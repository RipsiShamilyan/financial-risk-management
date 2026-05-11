import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../css/LoanCalculator.css";

const LoanCalculator = ({ userId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  const calculateLoan = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/calculate-loan", {
        user_id: userId,
        loan_amount: data.loanAmount,
        loan_term: data.loanTerm,
        interest_rate: data.interestRate,
      });

      setMonthlyPayment(response.data.monthlyPayment.toFixed(2));
      setTotalPayment(response.data.totalPayment.toFixed(2));
    } catch (error) {
      console.error("Error calculating loan:", error);
    }
  };

  return (
    <div className="loan-calculator-container">
      <h2 className="loan-title">Վարկային հաշվիչ</h2>
      <form onSubmit={handleSubmit(calculateLoan)} className="loan-form">
        <div className="input-group">
          <input
            type="text"
            className="loan-input"
            placeholder="Վարկի գումար"
            {...register("loanAmount", { required: "Վարկի գումարը պարտադիր է", pattern:{
                value: /^[0-9]+(\.[0-9]+)?$/,
                message:"Մուտքագրեք մենակ թիվ"
            } })}
          />
          {errors.loanAmount && <span className="error-message">{errors.loanAmount.message}</span>}

          <input
            type="text"
            className="loan-input"
            placeholder="Վարկի ժամկետ (ամիս)"
            {...register("loanTerm", { required: "Վարկի ժամկետը պարտադիր է", pattern:{
                value: /^[0-9]+(\.[0-9]+)?$/,
                message:"Մուտքագրեք մենակ թիվ"
            } })}
          />
          {errors.loanTerm && <span className="error-message">{errors.loanTerm.message}</span>}

          <input
            type="text"
            className="loan-input"
            placeholder="Տոկոսադրույք"
            {...register("interestRate", { required: "Տոկոսադրույքը պարտադիր է", pattern:{
                value: /^[0-9]+(\.[0-9]+)?$/,
                message:"Մուտքագրեք մենակ թիվ"
            }})}
          />
          {errors.interestRate && <span className="error-message">{errors.interestRate.message}</span>}
        </div>

        <button type="submit" className="calculate-btn">Հաշվել</button>
      </form>

      {monthlyPayment && (
        <div className="loan-results">
          <p>Ամսական մարում: <span>{monthlyPayment}</span> դրամ</p>
          <p>Ընդհանուր մարում: <span>{totalPayment}</span> դրամ</p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
