import EMICalculator from "./EMICalculator";

const PersonalLoanEMICalculator = () => {
  return (
    <EMICalculator
      title="Personal Loan EMI Calculator"
      description="Calculate your monthly EMI and total interest payable for your personal loan"
      defaultPrincipal={500000}
      maxPrincipal={2500000}
      minRate="10"
      maxRate="18"
    />
  );
};

export default PersonalLoanEMICalculator;
