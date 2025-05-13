function calculate() {
  animateCalculateButton();

  const orderDetails = getOrderQuantities();
  
  const partWeights = {
    leg: 250,
    wing: 250,
    fleshPortion: 1000
  };

  const chickensRequired = determineChickensNeeded(orderDetails);

  const orderSummary = calculateOrderSummary(orderDetails, chickensRequired, partWeights);
  
  showResultsWithAnimation(orderSummary, chickensRequired);
}

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
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  setupInputAnimations();
});

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
