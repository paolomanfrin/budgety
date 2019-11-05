var BudgetController = (function(){
    
    var incomeList = [];
    var expensesList = [];
    var entryType = {EXPENSE: 'exp', INCOME: 'inc'};
    
    return {
        
        TotalIncome: function(){
            var totIncome = incomeList.reduce(function(a,b){return a + b.amount},0);
            console.log('total income: ' + totIncome);
        },
        
        TotalExpenses: function(){
            var totExpenses = expensesList.reduce(function(a,b){return a + b.amount},0);
            console.log('total expenses: ' + totExpenses);
        },
        
        AddEntry: function(type, description, amount){
            var id;
            amount = parseFloat(amount);
            if (type == entryType.EXPENSE) {
                id = expensesList.length == 0 ? 0 : expensesList[expensesList.length-1].id+1;
                var newExpIdx = expensesList.push({id, type, description, amount})-1;
                return expensesList[newExpIdx];
            }
            else {
                id = incomeList.length == 0 ? 0 : incomeList[incomeList.length-1].id+1;
                var newIncIdx = incomeList.push({id, type, description, amount})-1;
                return incomeList[newIncIdx];
            }
            
        }      
}
    
})();

var UIController = (function(){
    
    var DOMString = {
        strDescription: '.add__description',
        strAmount: '.add__value',
        strAdd: '.add__btn',
        strType: '.add__type',
        strIncomeList: '.income__list',
        strExpenseList: '.expenses__list'
    }; 
    
    var DOM = function() {
        return {
                description: document.querySelector(DOMString.strDescription).value,
                amount: document.querySelector(DOMString.strAmount).value,
                btnAdd: document.querySelector(DOMString.strAdd),
                type: document.querySelector(DOMString.strType).value,
                incomeList: document.querySelector(DOMString.strIncomeList),
                expenseList: document.querySelector(DOMString.strExpenseList)
        }
    }
    
    var AddListItem = function(obj)
    {
        var inputHTML, outputHTML, element;
        
        if (obj.type==='inc'){
            element = DOMString.strIncomeList;

            inputHTML = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (obj.type==='exp'){

            element = DOMString.strExpenseList;    

            inputHTML = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';    
        }
        
        // Replace the placeholder text with data
        outputHTML = inputHTML.replace('%description%', obj.description).replace('%amount%', obj.amount).replace('%id%', obj.id);
        
        // insert HTML in the DOM
        document.querySelector(element).insertAdjacentHTML("beforeend", outputHTML);   
        
        
        
    }
        
    return { DOM, DOMString, AddListItem };
    
})();

var GlobalController = (function(uiCtrl, bdgtCtrl){
    // variables
    this.UICtrl = uiCtrl;
    this.BudgetCtrl = bdgtCtrl;
  
    // event listeners
    var InitHandlers = function(){
        UICtrl.DOM().btnAdd.addEventListener('click',AddAmountCallBack);
        document.querySelector(UICtrl.DOMString.strAmount).addEventListener('keyup', EnterCallBack(event){
            if (event.keyCode===13)
            AddAmountCallBack();
        });
    }
    
        
    function AddAmountCallBack(){
        var entry;
        var DOM = UICtrl.DOM();
        
        console.log('desc/amount: ' +  DOM.description + ' / ' + DOM.amount);
        entry = BudgetCtrl.AddEntry(DOM.type, DOM.description, DOM.amount);
        UICtrl.AddListItem(entry);
        
    }
    
    return {Init: function() { 
        InitHandlers();
        }
    };
    
})(UIController, BudgetController);

GlobalController.Init();
