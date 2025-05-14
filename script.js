  let inventory = {
      legs: 0,
      wings: 0,
      fleshPortions: 0
    };

    // Initialize local storage if needed
    document.addEventListener('DOMContentLoaded', function() {
      setupInputAnimations();
      loadInventoryFromStorage();
      updateInventoryDisplay();
    });

    // Load inventory from localStorage if available
    function loadInventoryFromStorage() {
      const savedInventory = localStorage.getItem('chickenInventory');
      if (savedInventory) {
        inventory = JSON.parse(savedInventory);
      }
    }

    // Save inventory to localStorage
    function saveInventoryToStorage() {
      localStorage.setItem('chickenInventory', JSON.stringify(inventory));
    }

    // Update the visual inventory display
    function updateInventoryDisplay() {
      document.getElementById('legs-available').textContent = inventory.legs;
      document.getElementById('wings-available').textContent = inventory.wings;
      document.getElementById('flesh-available').textContent = inventory.fleshPortions;
    }

    // Add individual parts to inventory
    function addToInventory() {
      const legsToAdd = parseInt(document.getElementById('add-legs').value) || 0;
      const wingsToAdd = parseInt(document.getElementById('add-wings').value) || 0;
      const fleshToAdd = parseInt(document.getElementById('add-flesh').value) || 0;
      
      inventory.legs += legsToAdd;
      inventory.wings += wingsToAdd;
      inventory.fleshPortions += fleshToAdd;
      
      // Reset input fields
      document.getElementById('add-legs').value = 0;
      document.getElementById('add-wings').value = 0;
      document.getElementById('add-flesh').value = 0;
      
      // Show success notification
      showInventoryNotification('success', `Added ${legsToAdd} legs, ${wingsToAdd} wings, and ${fleshToAdd} flesh portions to inventory`);
      
      // Update display and save to storage
      updateInventoryDisplay();
      saveInventoryToStorage();
    }

    // Add whole chickens to inventory
    function addWholeChickens() {
      const chickensToAdd = parseInt(document.getElementById('add-chickens').value) || 0;
      
      if (chickensToAdd > 0) {
        // Each chicken provides 2 legs, 2 wings, and 4 flesh portions
        inventory.legs += chickensToAdd * 2;
        inventory.wings += chickensToAdd * 2;
        inventory.fleshPortions += chickensToAdd * 4;
        
        // Reset input field
        document.getElementById('add-chickens').value = 0;
        
        // Show success notification
        showInventoryNotification('success', `Added ${chickensToAdd} whole chickens to inventory`);
        
        // Update display and save to storage
        updateInventoryDisplay();
        saveInventoryToStorage();
      }
    }

    // Show notification for inventory actions
    function showInventoryNotification(type, message) {
      // Create notification if it doesn't exist
      let notification = document.getElementById('inventory-notification');
      if (!notification) {
        notification = document.createElement('div');
        notification.id = 'inventory-notification';
        notification.className = 'alert animate__animated animate__fadeIn';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '1050';
        document.body.appendChild(notification);
      }
      
      // Set notification type and message
      notification.className = `alert animate__animated animate__fadeIn alert-${type}`;
      notification.innerHTML = `<i class="fas fa-info-circle me-2"></i>${message}`;
      
      // Show notification
      notification.style.display = 'block';
      
      // Hide after 3 seconds
      setTimeout(() => {
        notification.className = notification.className.replace('animate__fadeIn', 'animate__fadeOut');
        setTimeout(() => {
          notification.style.display = 'none';
        }, 500);
      }, 3000);
    }

    // Modified calculate function to check inventory
    function calculate() {
      animateCalculateButton();

      const orderDetails = getOrderQuantities();
      
      // Check if we have enough inventory for this order
      if (!checkInventoryAvailability(orderDetails)) {
        showResultsWithError("Insufficient inventory for this order!");
        return;
      }
      
      const partWeights = {
        leg: 250,
        wing: 250,
        fleshPortion: 1000
      };

      const chickensRequired = determineChickensNeeded(orderDetails);

      const orderSummary = calculateOrderSummary(orderDetails, chickensRequired, partWeights);
      
      // Deduct from inventory
      deductFromInventory(orderDetails);
      
      showResultsWithAnimation(orderSummary, chickensRequired);
    }

    // Check if there's enough inventory for the order
    function checkInventoryAvailability(order) {
      return (
        inventory.legs >= order.legs &&
        inventory.wings >= order.wings &&
        inventory.fleshPortions >= order.fleshPortions
      );
    }

    // Deduct ordered items from inventory
    function deductFromInventory(order) {
      inventory.legs -= order.legs;
      inventory.wings -= order.wings;
      inventory.fleshPortions -= order.fleshPortions;
      
      // Update display and save to storage
      updateInventoryDisplay();
      saveInventoryToStorage();
    }

    // Show error message when inventory is insufficient
    function showResultsWithError(errorMessage) {
      const resultsContainer = document.getElementById("output");
      
      resultsContainer.classList.remove("animate__fadeInUp", "d-none");
      void resultsContainer.offsetWidth;
      resultsContainer.classList.add("animate__fadeInUp", "d-block");
      
      resultsContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>${errorMessage}
        </div>
        <div class="inventory-status mt-3">
          <h5>Current Inventory</h5>
          <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span><i class="fas fa-bone me-2"></i>Legs</span>
              <span class="badge bg-primary rounded-pill">${inventory.legs}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span><i class="fas fa-feather-alt me-2"></i>Wings</span>
              <span class="badge bg-primary rounded-pill">${inventory.wings}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span><i class="fas fa-meat me-2"></i>Flesh Portions</span>
              <span class="badge bg-primary rounded-pill">${inventory.fleshPortions}</span>
            </li>
          </ul>
        </div>
      `;
    }

    // Original Functions
    function animateCalculateButton() {
      const calculateButton = document.getElementById("calculate-btn");
      
      calculateButton.classList.add("animate__animated", "animate__pulse");
      calculateButton.style.boxShadow = "0 0 15px var(--primary-color)";

      setTimeout(() => {
        calculateButton.classList.remove("animate__animated", "animate__pulse");
        calculateButton.style.boxShadow = "0 6px 15px var(--shadow-light)";
      }, 1000);
    }

    function getOrderQuantities() {
      return {
        legs: parseInt(document.getElementById("legs").value) || 0,
        wings: parseInt(document.getElementById("wings").value) || 0,
        fleshPortions: parseInt(document.getElementById("flesh").value) || 0
      };
    }

    function determineChickensNeeded(order) {
      let chickensNeeded = Math.max(
        Math.ceil(order.legs / 2),
        Math.ceil(order.wings / 2),
        order.fleshPortions
      );

      while (
        chickensNeeded * 2 < order.legs ||
        chickensNeeded * 2 < order.wings ||
        chickensNeeded < order.fleshPortions
      ) {
        chickensNeeded++;
      }
      
      return chickensNeeded;
    }

    function calculateOrderSummary(order, chickensNeeded, weights) {
      const orderWeight = {
        legs: order.legs * weights.leg,
        wings: order.wings * weights.wing,
        fleshPortions: order.fleshPortions * weights.fleshPortion
      };
      
      const totalOrderWeight = orderWeight.legs + orderWeight.wings + orderWeight.fleshPortions;
      
      const availableParts = {
        legs: chickensNeeded * 2,
        wings: chickensNeeded * 2,
        fleshPortions: chickensNeeded
      };
      
      const remainingInventory = {
        legs: availableParts.legs - order.legs,
        wings: availableParts.wings - order.wings,
        fleshPortions: availableParts.fleshPortions - order.fleshPortions
      };
      
      const remainingWeight = 
        remainingInventory.legs * weights.leg +
        remainingInventory.wings * weights.wing +
        remainingInventory.fleshPortions * weights.fleshPortion;
        
      return {
        totalOrderWeightGrams: totalOrderWeight,
        totalOrderWeightKg: (totalOrderWeight / 1000).toFixed(2),
        remainingInventory: remainingInventory,
        remainingWeightGrams: remainingWeight,
        remainingWeightKg: (remainingWeight / 1000).toFixed(2),
        weights: weights
      };
    }

    function showResultsWithAnimation(summary, chickensNeeded) {
      const resultsContainer = document.getElementById("output");
      
      resultsContainer.classList.remove("animate__fadeInUp", "d-none");
      
      void resultsContainer.offsetWidth;
      
      resultsContainer.classList.add("animate__fadeInUp", "d-block");
      
      resultsContainer.innerHTML = `
        <h4 class="mb-3 text-primary"><i class="fas fa-clipboard-check me-2"></i>Results</h4>
        
        <div class="row g-3">
          <div class="col-sm-6">
            <div class="p-3 border rounded text-center bg-light">
              <div class="fs-1 text-primary">${summary.totalOrderWeightKg}</div>
              <div class="text-muted">Total Order Weight (kg)</div>
            </div>
          </div>
          
          <div class="col-sm-6">
            <div class="p-3 border rounded text-center bg-light">
              <div class="fs-1 text-primary">${chickensNeeded}</div>
              <div class="text-muted">Chickens Needed</div>
            </div>
          </div>
        </div>
        
        <h5 class="mt-4 mb-3">Remaining Parts</h5>
        
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Part</th>
                <th>Quantity</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><i class="fas fa-bone me-2"></i>Legs</td>
                <td>${summary.remainingInventory.legs}</td>
                <td>${(summary.remainingInventory.legs * summary.weights.leg / 1000).toFixed(2)} kg</td>
              </tr>
              <tr>
                <td><i class="fas fa-feather-alt me-2"></i>Wings</td>
                <td>${summary.remainingInventory.wings}</td>
                <td>${(summary.remainingInventory.wings * summary.weights.wing / 1000).toFixed(2)} kg</td>
              </tr>
              <tr>
                <td><i class="fas fa-meat me-2"></i>Flesh</td>
                <td>${summary.remainingInventory.fleshPortions}</td>
                <td>${(summary.remainingInventory.fleshPortions * summary.weights.fleshPortion / 1000).toFixed(2)} kg</td>
              </tr>
            </tbody>
            <tfoot class="table-light">
              <tr>
                <th colspan="2">Total Remaining Weight</th>
                <th>${summary.remainingWeightKg} kg</th>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div class="mt-4 alert alert-info">
          <i class="fas fa-info-circle me-2"></i>The order has been processed and inventory has been updated.
        </div>
      `;
    }

    function setupInputAnimations() {
      const inputFields = document.querySelectorAll('input');
      
      inputFields.forEach(input => {
        input.addEventListener('focus', function() {
          this.parentElement.classList.add('animate__animated', 'animate__pulse');
        });
        
        input.addEventListener('blur', function() {
          this.parentElement.classList.remove('animate__animated', 'animate__pulse');
        });
      });
    }