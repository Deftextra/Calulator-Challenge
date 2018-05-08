import * as ko from "knockout";

namespace Calculator { 
    
    export class ViewModel { 
        inputExpression = ko.observable("")
        outputResult = ko.observable("")

        calculate (): void  { 
            alert("hello you pressed calculate"); 
            let inputCalc = this.inputExpression(); 
            this.outputResult(inputCalc + "hello"); 
            
        }
    }
}

ko.applyBindings(new Calculator.ViewModel()); 
 
