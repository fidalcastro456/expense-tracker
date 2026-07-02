import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { 
    faAdd,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

function ExpenseTracker(){
    const [currentName, setCurrentName] = useState("");
    const [currentAmount, setCurrentAmount] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [defaultText, setDefaultText] = useState(true);
    const total = expenses.reduce((sum, expense)=>{
        return sum + Number(expense.amount);
    },0);
    const [error, setError] = useState("");

    function handleNameChange(event){
        setCurrentName(event.target.value);
    }
    function handleAmountChange(event){
        setCurrentAmount(event.target.value);
    }
    function addExpense(){
        if((currentName.trim() !== "") && (currentAmount !== "") && ((Number(currentAmount) > 0 && Number(currentAmount) < 1000000000000)) && (currentName.length < 25)){
        setExpenses([...expenses,{
            name: currentName,
            amount: currentAmount
        }]);
        setCurrentName("");
        setCurrentAmount("");
        setError("");
        }
        if(currentName.trim() == "" || currentAmount == ""){
            setError("input cannot be empty")
        }
        if(currentAmount == '0' || currentAmount < 0){
            setError("amount cannot be 0 or less.")
        }
        if(currentName.length > 25){
            setError("cannot exceed 25 characters.")
        }
        if(Number(currentAmount) >= 1000000000000){
            setError("cannot exceed 1 trillion.")
        }
    }
    function removeExpense(index){
        setExpenses(expenses.filter((_, i)=> i !== index));
    }
    return(
        <>
            <div className="container">
                <div className="title">
                    <h1>Expense Tracker</h1>
                </div>
                <div className="total">
                    <p>Total Expenses: ₹{total.toLocaleString()}</p>
                </div>
                <div className="Field">
                    <div className="inputField">
                        <p>Name:</p>
                        <input value={currentName} onChange={handleNameChange} type="text" placeholder=" ex: rent"/>
                        <p>Amount(₹):</p>
                        <input value={currentAmount} onChange={handleAmountChange} type="number" placeholder=" ex: ₹10,000"/>
                    </div>
                    <div className="buttonField">
                        {
                            error && <p className="errorText">{error}</p>
                        }
                        <button onClick={addExpense}><FontAwesomeIcon icon={faAdd}/></button>
                    </div>
                </div>
                <div className="expenses">
                    {   (expenses.length === 0) ? (<p className="defaultText">No expenses yet.</p>) :    
                        (expenses.map((expense, index)=>
                            <div className="elements" key={index}>
                                <p className="nameElement">{expense.name}</p>
                                <p className="amountElement">₹{Number(expense.amount).toLocaleString()}</p>
                                <button className="deleteButton" onClick={()=>removeExpense(index)}><FontAwesomeIcon icon={faTrash}/></button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}
export default ExpenseTracker  