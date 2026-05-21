import EMICalculator from "./EMICalculator";

const CarLoanEMICalculator = () => {
  return (
    <EMICalculator
      title="Car Loan EMI Calculator"
      description="Calculate your monthly EMI and total interest payable for your car loan"
      defaultPrincipal={1000000}
      maxPrincipal={5000000}
      minRate="5"
      maxRate="12"
    />
  );
};

export default CarLoanEMICalculator;
