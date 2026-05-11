import React, { useState } from "react";
import { useForm } from "react-hook-form";
import '../css/RiskAssessment.css';
import API_URL from '../config';

const RiskAssessment = () => {
  const [totalScore, setTotalScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  // React Hook Form-ի hook-ը
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const calculatedScore = Number(data.income) + Number(data.savings) + Number(data.debt) + Number(data.emergencyFund);
    
    try {
      const response = await fetch(`${API_URL}/risk-assessment/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, total_score: calculatedScore }),
      });

      const result = await response.json();
      if (result.success) {
        setRiskLevel(result.risk_level);
      } else {
        alert("Failed to submit risk assessment");
      }
    } catch (error) {
      console.error("Error submitting risk assessment:", error);
    }
  };

  const renderRiskAdvice = () => {
    if (riskLevel === "low") {
      return (
        <div className="risk-advice">
          <h4>👍 Ռիսկի ցածր մակարդակ</h4>
          <p>Դուք գտնվում եք ապահով ֆինանսական իրավիճակում: Մասնակցեք երկարաժամկետ ներդրումային ծրագրերին ու շարունակեք խնայել ձեր ֆինանսները:</p>
        </div>
      );
    } else if (riskLevel === "medium") {
      return (
        <div className="risk-advice">
          <h4>⚠️ Ռիսկի միջին մակարդակ</h4>
          <p>Դուք կարող եք օգտագործել ավելի շատ խնայողություններ՝ նվազեցնելու համար պարտքի բեռը: Կողմնորոշվեք ֆինասական պլանավորման մասնագետների մոտ:</p>
        </div>
      );
    } else if (riskLevel === "high") {
      return (
        <div className="risk-advice">
          <h4>🚨 Ռիսկի բարձր մակարդակ</h4>
          <p>Դուք գտնվում եք բարձր ռիսկի վիճակում: Խորհուրդ ենք տալիս արագորեն կազմակերպել պարտքերի վերանայում և մեծացնել ձեր խնայողությունները:</p>
        </div>
      );
    }
  };

  return (
    <div className="risk-assessment-container">
      <h2 className="risk-assessment-header">📊 Ֆինանսական ռիսկի գնահատում</h2>
      
      {/* Հարց 1 */}
      <h3 className="question-header">Ո՞րն է ձեր ամսական միջին եկամուտը։</h3>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            value="1"
            {...register("income", { required: true })}
            className="radio-input"
          /> {"< 200,000 դրամ"}
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="2"
            {...register("income", { required: true })}
            className="radio-input"
          /> 200,000 - 500,000 դրամ
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="3"
            {...register("income", { required: true })}
            className="radio-input"
          /> 500,000 - 1,000,000 դրամ
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="4"
            {...register("income", { required: true })}
            className="radio-input"
          /> {"> 1,000,000 դրամ"}
        </label>
      </div>
      {errors.income && <p className="error-message">Այս հարցը պարտադիր է*</p>}

      {/* Հարց 2 */}
      <h3 className="question-header">Ի՞նչ տոկոս եք հատկացնում ձեր խնայողություններին։</h3>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            value="1"
            {...register("savings", { required: true })}
            className="radio-input"
          /> 0%
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="2"
            {...register("savings", { required: true })}
            className="radio-input"
          /> 1-10%
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="3"
            {...register("savings", { required: true })}
            className="radio-input"
          /> 11-30%
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="4"
            {...register("savings", { required: true })}
            className="radio-input"
          /> {"> 30%"}
        </label>
      </div>
      {errors.savings && <p className="error-message">Այս հարցը պարտադիր է*</p>}

      {/* Հարց 3 */}
      <h3 className="question-header">Ո՞րն է ձեր ընդհանուր պարտքային բեռը (վարկեր, ապառիկներ, վարձակալություն) ձեր եկամտի համեմատությամբ։</h3>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            value="4"
            {...register("debt", { required: true })}
            className="radio-input"
          /> {"> 50% (բարձր ռիսկ)"}
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="3"
            {...register("debt", { required: true })}
            className="radio-input"
          /> 30-50%
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="2"
            {...register("debt", { required: true })}
            className="radio-input"
          /> 10-30%
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="1"
            {...register("debt", { required: true })}
            className="radio-input"
          /> {"< 10% (ցածր ռիսկ)"}
        </label>
      </div>
      {errors.debt && <p className="error-message">Այս հարցը պարտադիր է*</p>}

      {/* Հարց 4 */}
      <h3 className="question-header">Ի՞նչ ֆինանսական բարձիկ ունեք (emergency fund)։</h3>
      <div className="radio-group">
        <label className="radio-label">
          <input
            type="radio"
            value="1"
            {...register("emergencyFund", { required: true })}
            className="radio-input"
          /> Չունեմ
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="2"
            {...register("emergencyFund", { required: true })}
            className="radio-input"
          /> 1-3 ամսվա ծախսեր
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="3"
            {...register("emergencyFund", { required: true })}
            className="radio-input"
          /> 3-6 ամսվա ծախսեր
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="4"
            {...register("emergencyFund", { required: true })}
            className="radio-input"
          />{" > 6 ամսվա ծախսեր"}
        </label>
      </div>
      {errors.emergencyFund && <p className="error-message">Այս հարցը պարտադիր է*</p>}

      <button onClick={handleSubmit(onSubmit)} className="submit-button">Հաշվել ռիսկի մակարդակը</button>

      {riskLevel && (
        <div className="risk-level-display">
          <h3>📌 Ձեր ռիսկի մակարդակը՝ <span className={`risk-level ${riskLevel}`}>{riskLevel}</span></h3>
          {renderRiskAdvice()}
        </div>
      )}
    </div>
  );
};

export default RiskAssessment;
