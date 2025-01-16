interface OpportunityCardProps {
    title: string;
    company: string;
    buttonText: string;
  }
  
  export default function OpportunityCard({ title, company, buttonText }: OpportunityCardProps) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md text-center">
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-600">{company}</p>
        <button className="mt-4 text-blue-600">{buttonText}</button>
      </div>
    );
  }
  