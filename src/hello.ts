import * as ko from "knockout";




//If we need run time control of variables put them in viewModel. 

namespace Calculator { 
        //Lexer: 
        function lexer(Calculation: string): Array<string> { 
            let tokens: any = []; 
        
            let tokenRegEx =  /\s*([A-Za-z]+|[0-9]+|\S)\s*/g; 
        
            let m; 
        
            while ((m = tokenRegEx.exec(Calculation)) !== null) {
                tokens.push(m[1]); 
            }
            return tokens; 
        }
    
        //Test function: 
        function isNumber(token: string) { 
            return (token !== undefined) && (token.match(/^[0-9]$/)) !== null 
        }
    
        //Parse function
    
        export function parse(Calculation: string) { 
            
            let tokens = lexer(Calculation); 
            let position  = 0; 
    
            function see(): string { 
                return tokens[position]; 
            }
    
            function consume(token: string): void { 
                if (token !== tokens[position]) {
                    throw "Only consume tokens at current position"; 
                }
                position++; 
            }
    
    
            //Grammer
            function parsePrime(): any { 
                let t = see();
    
                if (isNumber(t)) {
                    consume(t); 
                    return {type: "number", value: t }; 
                }
                else if (t === "(") { 
                    consume(t);
                    var expr = parseExpr();
                    if (see() !== ")") {
                        alert("expected )");  
                        //needs to display error in results
                        throw new SyntaxError("expected )");
                    }
                    consume(")");
                    return expr;
                }
                else {
                    //needs to display error in results
                    throw new SyntaxError("Error: All characters must be a number or parenthese");
                }
            }

            function parseMul() {
                var expr = parsePrime();
                var t = see();
                while (t === "*" || t === "/") {
                    consume(t);
                    var rhs = parsePrime();
                    expr = {type: t, left: expr, right: rhs};
                    t = see();
                }
                return expr;
            }

            function parseExpr(){
                let expr = parseMul();
                let t = see();
                while (t === "+" || t === "-") {
                    consume(t);
                    let rhs = parseMul();
                    expr = {type: t, left: expr, right: rhs};
                    t = see();
                }
                return expr;
            }

            let result = parseExpr()

            if (position !== tokens.length) { 
                //needs to display error in results 
                throw new SyntaxError("Wrong chracters:'" + see() + "'")
            }
            return result; 

        }
    
    export function treeValue(tree: any): number { 
        if (tree.type === '+') { 
            return treeValue(tree.left) + treeValue(tree.right); 
        }
        else if (tree.type === '-') { 
            return treeValue(tree.left) - treeValue(tree.right); 
        }
        else if (tree.type === '*') {
            return treeValue(tree.left) * treeValue(tree.right); 
        }
        else if (tree.type === '/') { 
            return treeValue(tree.left)/treeValue(tree.right)
        }

        else if  (tree.type === 'number') { 
            return Number(tree.value); 
        }

        else {
            return 0; 
        }
    }
    
    
    export class ViewModel { 
        inputExpression = ko.observable("")
        outputResult = ko.observable("")

        calculate (): void  { 
            let inputCalc = this.inputExpression(); 

        }
    }
}


let ViewModelIn = new Calculator.ViewModel(); 

let parseTree = Calculator.parse("(2 + 3)* dfdsf3 3 "); 

console.log(Calculator.treeValue(parseTree)); 


 
