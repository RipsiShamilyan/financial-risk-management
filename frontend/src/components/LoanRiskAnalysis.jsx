import React, { useState } from "react";
import { useForm } from "react-hook-form";
import '../css/LoanRiskAnalysis.css';

const LoanRiskAnalysis = () => {
  const { register, reset, handleSubmit, formState: { errors } } = useForm(); // react-hook-form
  const [existingLoan, setExistingLoan] = useState(false); 
  const [newLoan, setNewLoan] = useState(false); 
  const [dsr, setDsr] = useState(null); 
  const [loanRisk, setLoanRisk] = useState(null); 
  const [advice, setAdvice] = useState(""); 

  const onSubmit = (data) => {
    const existingLoanPayment = existingLoan ? (parseFloat(data.existingLoanAmount) / data.existingLoanTerm) : 0;
    const newLoanPayment = newLoan ? (parseFloat(data.newLoanAmount) / data.loanTerm) : 0;

    const totalLoanPayment = existingLoanPayment + newLoanPayment;
    const totalIncome = parseFloat(data.income);

    const calculatedDsr = (totalLoanPayment / totalIncome) * 100;
    setDsr(calculatedDsr);

    
    if (calculatedDsr < 30) {
      setLoanRisk("Վարկը անվտանգ է (ցածր ռիսկ)");
      setAdvice("Վարկը համարվում է անվտանգ և բնութագրվում է որպես ցածր ռիսկային, ինչը նշանակում է, որ այն չունի նշանակալի ֆինանսական վտանգներ և ապահովում է կայուն ու կանխատեսելի վճարումներ։"); // Ներկայացնում ենք խորհուրդները միայն բարձր ռիսկերի համար
    } else if (calculatedDsr >= 30 && calculatedDsr <= 50) {
      setLoanRisk("Վարկը վտանգավոր է (միջին ռիսկ)");
      setAdvice("Վարկը դասվում է վտանգավորների շարքին՝ ունենալով միջին ռիսկայնություն, ինչը նշանակում է, որ այն կարող է առաջացնել որոշակի ֆինանսական ծանրաբեռնվածություն ձեր բյուջեի վրա: Խորհուրդ. Եթե դա հնարավոր է, փորձեք բարձրացնել ձեր ամսական եկամուտը կամ նվազեցնել վարկի ընդհանուր գումարը, որպեսզի նվազի ձեր պարտավորությունների ծավալը և ձեր պարտքի բեռնվածության գործակիցը (DSR) մնա առավել անվտանգ մակարդակի վրա։");
    } else {
      setLoanRisk("Վարկը շատ ռիսկային է (բարձր ռիսկ)");
      setAdvice("Վարկը համարվում է խիստ ռիսկային և դասվում է բարձր ռիսկային վարկերի շարքին, ինչը նշանակում է, որ այն կարող է էական ազդեցություն ունենալ ձեր ֆինանսական կայունության վրա և մեծացնել ձեր պարտքային պարտավորությունների ծանրաբեռնվածությունը։ **Խորհուրդ.** Նախքան նման վարկ վերցնելը, խորհուրդ է տրվում մանրակրկիտ վերլուծել ձեր ֆինանսական վիճակը, վերանայել առկա եկամուտներն ու ծախսերը և հնարավորության դեպքում փորձել նվազեցնել անխուսափելի ծախսերը։ Կախված ձեր ֆինանսական կարողություններից, դուք կարող եք դիմել վարկային պայմանների վերանայման, ինչպես նաև ուսումնասիրել լրացուցիչ եկամուտի աղբյուրներ՝ նվազեցնելու վարկի ազդեցությունը ձեր ընդհանուր բյուջեի վրա։");
    }
    reset();
  };

  return (
    <div className="loan-risk-analysis-container">
      <h2 className="header">📊 Բանկային վարկի ռիսկի հաշվարկ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label className="question-header">Ամսական եկամուտ</label>
          <input
            type="number"
            {...register("income", { required: "Ամսական եկամուտը պարտադիր է" })}
            className="input-field"
          />
          {errors.income && <span className="error">{errors.income.message}</span>}
        </div>
        <div className="input-group">
          <label className="question-header">Ամսական ֆիքսված ծախսեր</label>
          <input
            type="number"
            {...register("fixedExpenses", { required: "Ամսական ֆիքսված ծախսերը պարտադիր են" })}
            className="input-field"
          />
          {errors.fixedExpenses && <span className="error">{errors.fixedExpenses.message}</span>}
        </div>
        <div className="input-group">
          <label className="question-header">Ունեք գործող վարկ:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="yes"
                checked={existingLoan}
                onChange={() => setExistingLoan(true)}
              />{" "}
              Այո
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={!existingLoan}
                onChange={() => setExistingLoan(false)}
              />{" "}
              Ոչ
            </label>
          </div>
        </div>
        {existingLoan && (
          <>
            <div className="input-group">
              <label className="question-header">Գործող վարկի չափը</label>
              <input
                type="number"
                {...register("existingLoanAmount", { required: "Գործող վարկի չափը պարտադիր է" })}
                className="input-field"
              />
              {errors.existingLoanAmount && <span className="error">{errors.existingLoanAmount.message}</span>}
            </div>
            <div className="input-group">
              <label className="question-header">Գործող վարկի տոկոսադրույքը (%)</label>
              <input
                type="number"
                {...register("existingLoanInterest", { required: "Գործող վարկի տոկոսադրույքը պարտադիր է" })}
                className="input-field"
              />
              {errors.existingLoanInterest && <span className="error">{errors.existingLoanInterest.message}</span>}
            </div>
            <div className="input-group">
              <label className="question-header">Գործող վարկի ժամկետ (ամիսներով)</label>
              <input
                type="number"
                {...register("existingLoanTerm", { required: "Գործող վարկի ժամկետը պարտադիր է" })}
                className="input-field"
              />
              {errors.existingLoanTerm && <span className="error">{errors.existingLoanTerm.message}</span>}
            </div>
          </>
        )}
        <div className="input-group">
          <label className="question-header">Ունեք նոր վարկ:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="yes"
                checked={newLoan}
                onChange={() => setNewLoan(true)}
              />{" "}
              Այո
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={!newLoan}
                onChange={() => setNewLoan(false)}
              />{" "}
              Ոչ
            </label>
          </div>
        </div>
        {newLoan && (
          <>
            <div className="input-group">
              <label className="question-header">Նոր վարկի գումարը</label>
              <input
                type="number"
                {...register("newLoanAmount", { required: "Նոր վարկի գումարը պարտադիր է" })}
                className="input-field"
              />
              {errors.newLoanAmount && <span className="error">{errors.newLoanAmount.message}</span>}
            </div>
            <div className="input-group">
              <label className="question-header">Նոր վարկի տոկոսադրույքը (%)</label>
              <input
                type="number"
                {...register("newLoanInterest", { required: "Նոր վարկի տոկոսադրույքը պարտադիր է" })}
                className="input-field"
              />
              {errors.newLoanInterest && <span className="error">{errors.newLoanInterest.message}</span>}
            </div>
            <div className="input-group">
              <label className="question-header">Նոր վարկի ժամկետ (ամիսներով)</label>
              <input
                type="number"
                {...register("loanTerm", { required: "Նոր վարկի ժամկետը պարտադիր է" })}
                className="input-field"
              />
              {errors.loanTerm && <span className="error">{errors.loanTerm.message}</span>}
            </div>
          </>
        )}
        <button type="submit" className="submit-button">Հաշվել ռիսկի մակարդակը</button>
      </form>
      {dsr !== null && (
        <div className="result-display">
          <h3>📌 Ձեր DSR-ը՝ {dsr.toFixed(2)}%</h3>
          <p>{loanRisk}</p>
          {advice && <p><strong>Խորհուրդ:</strong> {advice}</p>}
        </div>
      )}
    </div>
  );
};

export default LoanRiskAnalysis;