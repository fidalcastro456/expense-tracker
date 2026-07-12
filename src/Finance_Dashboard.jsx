import { FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { 
    faAdd,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
import { useEffect, useState } from "react";

function ExpenseTracker(){
    const [currentType, setCurrentType] = useState("");
    const [currentName, setCurrentName] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [currentCategory, setCurrentCategory] = useState("");
    const [transactions, setTransactions] = useState(()=>{
        const saved = localStorage.getItem("transactions");
        return saved ? JSON.parse(saved) : [];
    });
    const [sort, setSort] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const total = transactions.reduce((sum, transaction)=>{
        return sum + Number(transaction.amount);
    },0);
    const incomeCategoryTotal = {};
    const expenseCategoryTotal = {};
    transactions.forEach((transaction)=>{
        if(transaction.type === "Income"){
            if(incomeCategoryTotal[transaction.category]){
                incomeCategoryTotal[transaction.category]+=Number(transaction.amount);
            }
            else{
                incomeCategoryTotal[transaction.category] = Number(transaction.amount);
            }
        }
        if(transaction.type === "Expense"){
            if(expenseCategoryTotal[transaction.category]){
                expenseCategoryTotal[transaction.category]+=Number(transaction.amount);
            }
            else{
                expenseCategoryTotal[transaction.category] = Number(transaction.amount);
            }
        }    
    });
    const incomeChartData = Object.entries(incomeCategoryTotal).map(([incomeCategory, incomeTotal])=>({
        incomeName: incomeCategory,
        incomeAmount: incomeTotal
    }));
    const expenseChartData = Object.entries(expenseCategoryTotal).map(([expenseCategory, expenseTotal])=>({
        expenseName: expenseCategory,
        expenseAmount: expenseTotal
    }));
    const colors = {

    // Income
    Salary: "#10B981",
    Freelance: "#14B8A6",
    Business: "#2563EB",
    Gift: "#8B5CF6",

    // Expense
    Food: "#F59E0B",
    Shopping: "#F43F5E",
    Transport: "#FACC15",
    Bills: "#DC2626",
    Other: "#64748B"

};
    const [error, setError] = useState("");

    useEffect(()=>{
        localStorage.setItem("transactions", JSON.stringify(transactions));
    },[transactions]);
    function hanldeTypeChange(event){
        setCurrentType(event.target.value);
    }
    function handleNameChange(event){
        setCurrentName(event.target.value);
    }
    function handleAmountChange(event){
        setCurrentAmount(event.target.value);
    }
    function handleDateChange(event){
        setCurrentDate(event.target.value);
    }
    function handleCategoryChange(event){
        setCurrentCategory(event.target.value);
    }
    function addTransaction(){
        if((currentType !== "") && (currentName.trim() !== "") && (currentAmount !== "") && (currentDate !== "") && (currentCategory !== "") && ((Number(currentAmount) > 0 && Number(currentAmount) < 1000000000000)) && (currentName.length < 25)){
        setTransactions(prev =>
            {
                const updated = [...prev,
                    {
                        type: currentType,
                        name: currentName,
                        amount: currentAmount,
                        date: currentDate,
                        category: currentCategory
                    }
                ];
                return updated;
            }
        );
        setCurrentType("");
        setCurrentName("");
        setCurrentAmount("");
        setCurrentDate("");
        setCurrentCategory("")
        setError("");
        }
        if(currentType == "" || currentName.trim() == "" || currentAmount == "" || currentDate == "" || currentCategory == ""){
            setError("please complete all the fields.")
        }
        if(currentAmount == '0' || currentAmount < 0){
            setError("amount cannot be 0 or lesser.")
        }
        if(currentName.length > 25){
            setError("cannot exceed 25 characters.")
        }
        if(Number(currentAmount) >= 1000000000000){
            setError("cannot exceed 1 trillion.")
        }
    }
    function removeTransaction(index){
        const confirm = window.confirm(`Are you sure you want to delete this transaction ?`);
        if(confirm){
            setTransactions(transactions.filter((_, i)=> i !== index));
        }
    }
    function handleSortChange(event){
        const selected = event.target.value;
        setSort(selected);
        const sorted = [...transactions];
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
        setTransactions(sorted);
    }
    return(
        <>
            <div className="container">
                <div className="containerUpper">
                    <h1>Finance Dashboard</h1>
                </div>
                <div className="containerLower">
                    <div className="input">
                        <div className="inputField1">
                            <p>Transaction Type</p>
                            <select value={currentType} className="transaction" onChange={hanldeTypeChange}>
                                <option value={""}>Select Type</option>
                                <option value={"Income"}>Income</option>
                                <option value={"Expense"}>Expense</option>
                            </select>
                            <p>Description</p>
                            <input value={currentName} onChange={handleNameChange} type="text"/>
                            <p>Amount</p>
                            <input value={currentAmount} onChange={handleAmountChange} type="number"/>
                            <p>Category</p>
                            {
                                currentType === "Income" ? 
                                (
                                    <select value={currentCategory} className="category" onChange={handleCategoryChange}>
                                        <option value={""}>Select category</option>
                                        <option value={"Salary"}>Salary</option>
                                        <option value={"Freelance"}>Freelance</option>
                                        <option value={"Business"}>Business</option>
                                        <option value={"Gift"}>Gift</option>
                                        <option value={"Other"}>Others</option>
                                    </select>
                                ):
                                (
                                    <select value={currentCategory} className="category" onChange={handleCategoryChange}>
                                        <option value={""}>Select category</option>
                                        <option value={"Food"}>Food</option>
                                        <option value={"Shopping"}>Shopping</option>
                                        <option value={"Transport"}>Transport</option>
                                        <option value={"Bills"}>Bills</option>
                                        <option value={"Other"}>Others</option>
                                    </select>
                                )
                            }
                            <p>Date</p>
                            <input value={currentDate} onChange={handleDateChange} type="date"/>
                        </div>
                        <div className="inputField2">
                            <button className="addBtn" onClick={addTransaction}><FontAwesomeIcon icon={faAdd}/>Add transaction</button>
                            {
                                error && <p className="errorText">{error}</p>
                            }
                        </div>
                        </div>
                        <div className="display">
                        <div className="dashboard">
                            <div className="dashboardLeft">
                                {
                                    (incomeChartData.length === 0) ? (<p className="defaultText">No income data to visualize.</p>) :
                                (
                                <ResponsiveContainer height="100%" width="100%">
                                    <BarChart width={200} height={200} data={incomeChartData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="incomeName" />
                                        <YAxis/>
                                        <Tooltip />
                                        <Bar dataKey="incomeAmount" fill="red">
                                            {
                                                incomeChartData.map((item)=>(
                                                    <Cell key={item.incomeName}
                                                    fill={colors[item.incomeName]}
                                                    />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                )
                                }
                            </div>
                            <div className="dashboardRight">
                                {
                                    (expenseChartData.length === 0) ? (<p className="defaultText">No expense data to visualize.</p>) :
                                (    
                                <ResponsiveContainer height="100%" width="100%">
                                    <BarChart width={200} height={200} data={expenseChartData}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="expenseName" />
                                        <YAxis/>
                                        <Tooltip />
                                        <Bar dataKey="expenseAmount" fill="red">
                                            {
                                                expenseChartData.map((item)=>(
                                                    <Cell key={item.expenseName}
                                                    fill={colors[item.expenseName]}
                                                    />
                                                ))
                                            }
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                )
                                }
                            </div>
                        </div>
                        {(transactions.length === 0) ? (<p className="defaultText">No transactions yet.</p>) : (
                        <div className="transactions">
                            <div className="transaction1">
                                <select className="sortTransaction" onChange={handleSortChange}>
                                    <option value={""}>Sort by</option>
                                    <option value={"newest"}>Newest date first</option>
                                    <option value={"oldest"}>Oldest date first</option>
                                    <option value={"highest"}>Highest transaction</option>
                                    <option value={"lowest"}>Lowest transaction</option>
                                </select>
                            </div>
                            <div className="transaction2">
                            {       
                                transactions.map((transaction, index)=>
                                    <div className="elements" key={index}>
                                        <div className="elementLeft">
                                            <p className="typeElement">Type: {transaction.type}</p>
                                            <p className="nameElement">Name: {transaction.name}</p>
                                            <p className="amountElement">Amount: ₹{Number(transaction.amount).toLocaleString()}</p>
                                        </div>
                                        <div className="elementMiddle">
                                            <p className="dateElement">Date: {transaction.date}</p>
                                            <p className="categoryElement">Category: {transaction.category}</p>
                                        </div>
                                        <div className="elementRight">
                                            <button className="deleteBtn" onClick={()=>removeTransaction(index)}><FontAwesomeIcon icon={faTrash}/></button>
                                        </div>
                                    </div>
                                )
                            }
                            </div>
                    </div>
                    )}
                    </div>
                </div>
            </div>
        </>
    );
}
export default ExpenseTracker 
{/* <p className="total">Total transactions: ₹{total.toLocaleString()}</p> */}