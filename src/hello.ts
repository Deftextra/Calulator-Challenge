import * as ko from "knockout";




//If we need run time control of variables put them in viewModel. 

namespace Calculator { 
        //Lexer: 
        export function lexer(calculation: string): Array<string> { 
            let tokens: any = []; 
        
            let tokenRegEx =  /\s*([A-Za-z]+|[0-9]+|\S)\s*/g; 
        
            let m; 
        
            while ((m = tokenRegEx.exec(calculation)) !== null) {
                tokens.push(m[1]); 
            }
            return tokens; 
        }

        //Test function: 
        function isNumber(token: string): boolean { 
            return (token !== undefined) && (token.match(/^[0-9]+$/)) !== null 
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
                    throw new Error("Only consume tokens at current position");
                }
                position++; 
            }
    
    
            //Gramer Rules. 
            function parsePrime(): any { 
                let t = see();
    
                if (isNumber(t)) {
                    consume(t); 
                    return {type: "number", value: t }; 
                }
                else if (t === "(") { 
                    //Ignore left bracket. 
                    consume(t);

                    //Start new parsing process on expression in closed brackets. 
                    var expr = parseExpr();
                    if (see() !== ")") {
                        throw new SyntaxError("expected ')'");
                    }
                    consume(")");
                    return expr;
                }
                else {
                        if (see() === '+' || see() === '-' || see() === '*'|| see() ==='/') 
                            throw new SyntaxError("' " + see() + "'" + "at wrong position");  
                        else { 
                            throw new SyntaxError("Token '" + see() + "' not allowed");
                        }
                                
                }
            }

            function parseMul() {
                let expr = parsePrime();
                let t = see();
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
               
                throw new SyntaxError("Wrong chracter:'" + see() + "'");
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
            return null; 
        }
    }

   
    
    
    export class ViewModel { 
        inputExpression = ko.observable(""); 
        outputResult = ko.observable(""); 

        calculate(): void {
            const calcInput = this.inputExpression(); 

            try {
                const parseTree = Calculator.parse(calcInput); 
                const value = Calculator.treeValue(parseTree);
                this.outputResult(String(value)); 
            }
            catch(e) { 
                this.outputResult(String(e));  
            }
        }
    }
}


let ViewModelIn = new Calculator.ViewModel(); 

ko.applyBindings(ViewModelIn);



 
