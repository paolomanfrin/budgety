var BudgetController = (function(){
    
    var incomeList = [];
    var expensesList = []; // {id, type, description, amount}
    var entryType = {EXPENSE: 'exp', INCOME: 'inc'};
    console.log(expensesList);
    
    
    return {
        
        TotalIncome: function(){
            var totIncome = incomeList.reduce(function(a,b){return a + b.amount},0);
            return totIncome;
            //console.log('total income: ' + totIncome);
        },
        
        TotalExpenses: function(){
            var totExpenses = expensesList.reduce(function(a,b){return a + b.amount},0);
            return totExpenses;
            //console.log('total expenses: ' + totExpenses);
        },
        
        AddEntry: function(type, description, amount){
            var id, percentage = -1;
            amount = parseFloat(amount);
            if (type == entryType.EXPENSE) {
                id = expensesList.length == 0 ? 0 : expensesList[expensesList.length-1].id+1;
                var newExpIdx = expensesList.push({id, type, description, amount, percentage})-1;
                return expensesList[newExpIdx];
            }
            else {
                id = incomeList.length == 0 ? 0 : incomeList[incomeList.length-1].id+1;
                var newIncIdx = incomeList.push({id, type, description, amount, percentage})-1;
                return incomeList[newIncIdx];
            }
            
        },
        
        RemoveEntry: function(entry){
            
            var entryTypeId = entry.split('-');
            var type = entryTypeId[0] == 'income' ? 'inc' : 'exp';
            var id = entryTypeId[1];
            
            console.log(type + ' / ' + id);
            
            if (type === entryType.INCOME) {
                
                incomeList = incomeList.filter(obj => {
                    return obj.id.toString() !== id;
                })
                
                console.log(incomeList);
                
            } else if (type === entryType.EXPENSE) {
                expensesList = expensesList.filter(obj => {
                    return obj.id.toString() !== id;
                })
            }
                
        },
        
        UpdatePercentages: function(){
            var budget = this.TotalIncome();
            
            function CalcPerc(item){
                item.percentage = Math.round(item.amount*100/budget);
            };
            
            expensesList.forEach(CalcPerc);
        },
        
        Budget: function(){
            this.UpdatePercentages();
            return {
                value: this.TotalIncome() - this.TotalExpenses(),
                income: this.TotalIncome(),
                expense: this.TotalExpenses(),
                percentage: this.TotalIncome() < 0? -1 : Math.round(this.TotalExpenses()*100/(this.TotalIncome())),
                GetExpense: function(idx){return expensesList[idx]}
                
            };
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
        strExpenseList: '.expenses__list',
        strBudgetValue: '.budget__value',
        strBudgetIncome: '.budget__income--value',
        strBudgetExpense: '.budget__expenses--value',
        strBudgetPercentage: '.budget__expenses--percentage',
        strContainer: '.container',
        strPercentage: '.item__percentage',
        strMonth: '.budget__title--month'
    }; 
    
    var DOM = function() {
        return {
                description: document.querySelector(DOMString.strDescription).value,
                amount: document.querySelector(DOMString.strAmount).value,
                btnAdd: document.querySelector(DOMString.strAdd),
                type: document.querySelector(DOMString.strType).value,
                incomeList: document.querySelector(DOMString.strIncomeList),
                expenseList: document.querySelector(DOMString.strExpenseList),
                container: document.querySelector(DOMString.strContainer)
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
    
    var RemoveEntry = function(elementId)
    {
        document.getElementById(elementId).remove();
        
    }
    
    var RefreshBudget = function(budget){
        document.querySelector(DOMString.strBudgetValue).innerHTML = budget.value;
        document.querySelector(DOMString.strBudgetIncome).textContent = budget.income;
        document.querySelector(DOMString.strBudgetExpense).textContent = budget.expense;
        
        if (isNaN(budget.percentage))
            document.querySelector(DOMString.strBudgetPercentage).textContent = '---';
        else
            document.querySelector(DOMString.strBudgetPercentage).textContent = budget.percentage + '%';
    }
    
    var RefreshPercentage = function(budget){
        
        // 1. retrieve the percentage elemens on UI
        var nodeList = document.querySelectorAll(DOMString.strPercentage);
        
        // 3. update the elements on UI
        var callback = function (item, index){
            perc = budget.GetExpense(index).percentage;
            item.textContent=perc+'%';
        };
        nodeList.forEach(callback);
        
        return nodeList;
        
        /*
        // Sample 01
        
        var NodeListForEach = function(nodelist, callback){
            
            for(var idx=0; idx<nodeList.length; idx++){
                callback(nodeList[idx], idx);
            }
        };
        
        NodeListForEach(nodeList, function(item, index){
            item.textContent='xxx'+index;
        });
        */
    }
    
    var RefreshMonth = function(){
        var datum, months;
        
        datum = new Date(Date.now());
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        console.log("refresh month");
        document.querySelector(DOMString.strMonth).innerHTML = months[datum.getMonth()] + " " + datum.getFullYear();
    }
    
    return { DOM, DOMString, AddListItem, RemoveEntry, RefreshBudget, RefreshPercentage, RefreshMonth };
    
})();

var GlobalController = (function(uiCtrl, bdgtCtrl){
    // variables
    this.UICtrl = uiCtrl;
    this.BudgetCtrl = bdgtCtrl;
  
    // event listeners
    var InitHandlers = function(){
        UICtrl.DOM().btnAdd.addEventListener('click',AddAmountCallBack);
        document.querySelector(UICtrl.DOMString.strAmount).addEventListener('keyup', function(event){
            if (event.keyCode===13)
            AddAmountCallBack();
        });
        UICtrl.DOM().container.addEventListener('click', RemoveAmountCallBack)
        
    }
    
        
    function AddAmountCallBack(){
        var entry, budget;
        var DOM = UICtrl.DOM();
        
        console.log(DOM.amount);
        if (isNaN(DOM.amount) || DOM.amount.length==0)
            return;
        
        entry = BudgetCtrl.AddEntry(DOM.type, DOM.description, DOM.amount);
        UICtrl.AddListItem(entry);
        
        
        budget = BudgetCtrl.Budget();
        UICtrl.RefreshBudget(budget);
        
        UICtrl.RefreshPercentage(budget);
    }
    
    function RemoveAmountCallBack(event){
        
       console.log(event.target);
        
        if (event.target.className === 'ion-ios-close-outline'){
            var element = event.target.closest('.item')
            
            // remove element from budget
            BudgetCtrl.RemoveEntry(element.id);
            
            // remove element from UI
            UICtrl.RemoveEntry(element.id);
            
            // refresh budget
            budget = BudgetCtrl.Budget();
            UICtrl.RefreshBudget(budget);
            
            // refresh percntage
            UICtrl.RefreshPercentage(budget);
        }
    }
    
    return {Init: function() { 
        InitHandlers();
        UICtrl.RefreshMonth();
        UICtrl.RefreshBudget(BudgetCtrl.Budget());
        }
    };
    
})(UIController, BudgetController);

GlobalController.Init();
