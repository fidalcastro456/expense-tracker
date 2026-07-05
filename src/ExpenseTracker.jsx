import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { 
    faAdd,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function ExpenseTracker(){
    const [currentName, setCurrentName] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [expenses, setExpenses] = useState(()=>{
        const saved = localStorage.getItem("expenses");
        return saved ? JSON.parse(saved) : [];
    });
    const [sort, setSort] = useState("");
    const total = expenses.reduce((sum, expense)=>{
        return sum + Number(expense.amount);
    },0);
    const [error, setError] = useState("");

    useEffect(()=>{
        console.log("Saving")
        localStorage.setItem("expenses", JSON.stringify(expenses));
    },[expenses]);

    function handleNameChange(event){
        setCurrentName(event.target.value);
    }
    function handleAmountChange(event){
        setCurrentAmount(event.target.value);
    }
    function handleDateChange(event){
        setCurrentDate(event.target.value);
    }
    function addExpense(){
        if((currentName.trim() !== "") && (currentAmount !== "") && (currentDate !== "") && ((Number(currentAmount) > 0 && Number(currentAmount) < 1000000000000)) && (currentName.length < 25)){
        setExpenses(prev =>
            {
                const updated = [...prev,
                    {
                        name: currentName,
                        amount: currentAmount,
                        date: currentDate
                    }
                ];
                return updated;
            }
        );
        setCurrentName("");
        setCurrentAmount("");
        setCurrentDate("");
        setError("");
        }
        if(currentName.trim() == "" || currentAmount == "" || currentDate == ""){
            setError("input cannot be empty.")
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
        const confirm = window.confirm("Are you sure you want to delete this expense?");
        if(confirm){
            setExpenses(expenses.filter((_, i)=> i !== index));
        }
    }
    function handleSortChange(event){
        const selected = event.target.value;
        setSort(selected);
        const sorted = [...expenses];
        if(selected == "highest"){
            sorted.sort((x, y)=> Number(y.amount) - Number(x.amount));
        }
        if(selected == "lowest"){
            sorted.sort((x, y)=> Number(x.amount) - Number(y.amount));
        }
        if(selected == "newest"){
            sorted.sort((x, y)=> {
                return new Date(y.date) - new Date(x.date);
            });
        }
        if(selected == "oldest"){
            sorted.sort((x, y)=>{
                return new Date(x.date) - new Date(y.date);
            });
        }
        setExpenses(sorted);
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
                        <p>Date:</p>
                        <input value={currentDate} onChange={handleDateChange} type="date"/>
                    </div>
                    <div className="buttonField">
                        {
                            error && <p className="errorText">{error}</p>
                        }
                        <button onClick={addExpense}><FontAwesomeIcon icon={faAdd}/></button>
                    </div>
                </div>
                <div className="expenses">
                    {
                        (expenses.length > 0) ? (
                        <select className="sortExpense" onChange={handleSortChange}>
                            <option value={""}>------sort by------</option>
                            <option value={"newest"}>newest date first</option>
                            <option value={"oldest"}>oldest date first</option>
                            <option value={"highest"}>highest expense</option>
                            <option value={"lowest"}>lowest expense</option>
                        </select>
                        ) : ("")
                    }
                    {   (expenses.length === 0) ? (<p className="defaultText">No expenses yet.</p>) :    
                        (expenses.map((expense, index)=>
                            <div className="elements" key={index}>
                                <div className="elementUpper">
                                    <p className="nameElement">{expense.name}</p>
                                    <p className="amountElement">₹{Number(expense.amount).toLocaleString()}</p>
                                    <button className="deleteButton" onClick={()=>removeExpense(index)}><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                                <div className="elementLower">
                                    <p className="dateElement">{expense.date}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}
export default ExpenseTracker  