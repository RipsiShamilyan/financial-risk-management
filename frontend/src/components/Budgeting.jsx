import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../css/Budgeting.css';
import axios from 'axios';

const Budgeting = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [budget, setBudget] = useState(0);
    const [budgetHistory, setBudgetHistory] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({ income: '', expenses: '' });
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchBudgetHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/budgeting/${userId}`);
                setBudgetHistory(response.data);
            } catch (error) {
                console.error('Error fetching budget history:', error);
            }
        };

        fetchBudgetHistory();
    }, [userId]);

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditData(budgetHistory[index]);
    };

    const saveEdit = async () => {
        const updatedHistory = [...budgetHistory];
        updatedHistory[editIndex] = {
            ...updatedHistory[editIndex],
            ...editData,
            budget: Number(editData.income) - Number(editData.expenses),
        };
        
        try {
            await axios.put(`http://localhost:5000/budgeting/${budgetHistory[editIndex].id}`, {
                income: editData.income,
                expenses: editData.expenses,
                budget: updatedHistory[editIndex].budget,
            });
            setBudgetHistory(updatedHistory);
            setEditIndex(null);
            setEditData({ income: '', expenses: '' });
        } catch (error) {
            console.error('Error saving budget edit:', error);
        }
    };

    const deleteBudget = async (index) => {
        try {
            await axios.delete(`http://localhost:5000/budgeting/${budgetHistory[index].id}`);
            const updatedHistory = budgetHistory.filter((_, i) => i !== index);
            setBudgetHistory(updatedHistory);
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const calculateBudget = async (data) => {
        const totalBudget = Number(data.income) - Number(data.expenses);
        setBudget(totalBudget);
    
        try {
            const response = await fetch('http://localhost:5000/budgeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId, 
                    income: data.income,
                    expenses: data.expenses,
                    budget: totalBudget,
                }),
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log('Տվյալները հաջողությամբ պահպանվել են:', result);
            } else {
                console.error('Պահպանման սխալ:', result.message);
            }
        } catch (error) {
            console.error('Հարցման սխալ:', error);
        }
    
        reset();
    };
    

    return (
        <div className="budgeting-container">
        <h2 className="budget-header">Բյուջետավորում</h2>
        <form className="budget-form" onSubmit={handleSubmit(calculateBudget)}>
            <div className="input-group">
                <input
                    type="number"
                    className="budget-input"
                    placeholder="Եկամուտ"
                    {...register('income', { 
                        required: 'Եկամուտը պարտադիր է', 
                        min: { value: 1, message: 'Եկամուտը պետք է լինի 0-ից մեծ' }
                    })}
                />
                {errors.income && <span className="error">{errors.income.message}</span>}

                <input
                    type="number"
                    className="budget-input"
                    placeholder="Ծախսեր"
                    {...register('expenses', { 
                        required: 'Ծախսերը պարտադիր է', 
                        min: { value: 0, message: 'Ծախսերը չեն կարող բացասական լինել' }
                    })}
                />
                {errors.expenses && <span className="error">{errors.expenses.message}</span>}

                <button type="submit" className="calculate-button">Հաշվարկել բյուջեն</button>
            </div>
        </form>

        <div className="result-container">
            <h3 className="budget-result">Ձեր բյուջեն: {budget}</h3>
        </div>

        <div className="history-container">
            <h3>Նախորդ բյուջեները:</h3>
            <ul className="history-list">
                {budgetHistory.map((history, index) => (
                    <li className="history-item" key={index}>
                        {editIndex === index ? (
                            <div className="edit-fields">
                                <input
                                    type="number"
                                    className="edit-input"
                                    value={editData.income}
                                    onChange={(e) => setEditData({ ...editData, income: e.target.value })}
                                    placeholder="Եկամուտ"
                                />
                                <input
                                    type="number"
                                    className="edit-input"
                                    value={editData.expenses}
                                    onChange={(e) => setEditData({ ...editData, expenses: e.target.value })}
                                    placeholder="Ծախսեր"
                                />
                                <button className="save-button" onClick={saveEdit}>Պահպանել</button>
                                <button className="cancel-button" onClick={() => setEditIndex(null)}>Չեղարկել</button>
                            </div>
                        ) : (
                            <div className="history-content">
                                Եկամուտ: <span className="income">{history.income}</span> | 
                                Ծախսեր: <span className="expenses">{history.expenses}</span> | 
                                Բյուջե: <span className="budget">{history.budget}</span>
                                <button className="edit-button" onClick={() => handleEdit(index)}>Խմբագրել</button>
                                <button className="delete-button" onClick={() => deleteBudget(index)}>Ջնջել</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);
};

export default Budgeting;
