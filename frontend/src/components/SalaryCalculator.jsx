import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../css/SalaryCalculator.css';

const SalaryCalculator = () => {
  const [currency, setCurrency] = useState('AMD');
  const [netSalary, setNetSalary] = useState(null);
  const [incomeTax, setIncomeTax] = useState(0);
  const [socialTax, setSocialTax] = useState(0);
  const [stampTax, setStampTax] = useState(0);
  const [error, setError] = useState('');
  const [salaryHistory, setSalaryHistory] = useState([]);

  const [reverseNetSalary, setReverseNetSalary] = useState('');
  const [calculatedGrossSalary, setCalculatedGrossSalary] = useState(null);

  const userId = localStorage.getItem('userId') || 1;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const calculateSalary = async (data) => {
    setError('');
    const { grossSalary } = data;

    if (!grossSalary || isNaN(grossSalary) || grossSalary <= 0) {
      setError('Մուտքագրեք ճիշտ գումար');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/calculate-salary', {
        grossSalary: parseFloat(grossSalary),
        currency,
        userId
      });

      setNetSalary(response.data.netSalary);
      setIncomeTax(response.data.incomeTax);
      setSocialTax(response.data.socialTax);
      setStampTax(response.data.stampTax);

      fetchSalaryHistory();
    } catch (err) {
      setError('Սխալ հաշվարկի ժամանակ');
    }
  };

  const fetchSalaryHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/salary-history/${userId}`);
      setSalaryHistory(response.data);
    } catch (error) {
      console.error('Չհաջողվեց բեռնել պատմությունը');
    }
  };

  const reverseCalculateSalary = () => {
    const net = parseFloat(reverseNetSalary);

    if (!net || isNaN(net) || net <= 0) {
      setError('Մուտքագրեք ճիշտ զուտ աշխատավարձ');
      return;
    }

    const stamp = 5500;
    const gross = (net + stamp) / 0.75; // 25% հարկեր (20% income + 5% social)

    setCalculatedGrossSalary(gross.toFixed(2));
  };

  useEffect(() => {
    fetchSalaryHistory();
  }, []);

  return (
    <div className="salary-calculator">
      <h2 className="title">Աշխատավարձի հաշվիչ</h2>

      <form onSubmit={handleSubmit(calculateSalary)}>
        <input
          className="input"
          type="text"
          placeholder="Համախառն աշխատավարձ"
          {...register('grossSalary', {
            required: 'Համախառն աշխատավարձը պարտադիր է',
            pattern: {
              value: /^[0-9]+(\.[0-9]+)?$/,
              message: 'Մուտքագրեք մենակ թիվ'
            },
            min: { value: 1, message: 'Աշխատավարձը պետք է լինի դրական' }
          })}
        />
        {errors.grossSalary && <p className="error">{errors.grossSalary.message}</p>}

        <select
          className="currency-selector"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="AMD">Դրամ (AMD)</option>
        </select>

        <button className="calculate-buttons" type="submit">Հաշվել</button>
      </form>

      {error && <p className="error">{error}</p>}

      {netSalary !== null && (
        <div className="results">
          <h3>Արդյունքներ</h3>
          <p><strong>Զուտ աշխատավարձ:</strong> {netSalary} {currency}</p>
          <p><strong>Եկամտային հարկ:</strong> {incomeTax} {currency}</p>
          <p><strong>Սոցիալական վճար:</strong> {socialTax} {currency}</p>
          <p><strong>Դրոշմանիշային վճար:</strong> {stampTax} {currency}</p>
        </div>
      )}

      <div className="reverse-calc">
        <input
          className="input"
          type="text"
          placeholder="Զուտ աշխատավարձ"
          value={reverseNetSalary}
          onChange={(e) => setReverseNetSalary(e.target.value)}
        />
        <button className="calculate-buttons" type="button" onClick={reverseCalculateSalary}>
          Հաշվել Համախառն
        </button>

        {calculatedGrossSalary && (
          <p><strong>Համախառն աշխատավարձը:</strong> {calculatedGrossSalary} {currency}</p>
        )}
      </div>


      {/* <h3>Հաշվարկների պատմություն</h3>
      <ul className="salary-history">
        {salaryHistory.map((salary, index) => (
          <li key={index}>
            {salary.gross_salary} {salary.currency} → {salary.net_salary} {salary.currency}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default SalaryCalculator;
