define(["require", "exports", "knockout"], function (require, exports, ko) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Calculator;
    (function (Calculator) {
        var ViewModel = /** @class */ (function () {
            function ViewModel() {
                this.inputExpression = ko.observable("");
                this.outputResult = ko.observable("");
            }
            ViewModel.prototype.calculate = function () {
                alert("hello you pressed calculate");
                var inputCalc = this.inputExpression();
                this.outputResult(inputCalc + "hello");
            };
            return ViewModel;
        }());
        Calculator.ViewModel = ViewModel;
    })(Calculator || (Calculator = {}));
    ko.applyBindings(new Calculator.ViewModel());
});
//# sourceMappingURL=hello.js.map