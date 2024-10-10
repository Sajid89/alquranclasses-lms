import React from "react";
import { CustomButton } from "../../../components";

const PlanCard = ({ plan }) => {
    const { name, price, recommended, features } = plan;

    return (
        <div className={`border ${recommended ? 'green-border border-2' : 'border-gray-200'} p-4 rounded-md relative`}>
            {recommended && (
                <div className="bg-green text-white text-xs py-1 px-2 rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2">
                    Recommended
                </div>
            )}
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <div className="text-2xl mb-4">
                <span className="font-bold">${price}</span>
                <span className="text-gray-400 text-sm">/mo</span>
            </div>
            <CustomButton customClass="w-full bg-green text-white mb-4">Choose Plan</CustomButton>
            <ul>
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                        <span className="bg-green w-2 h-2 rounded-full mr-2"></span>
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlanCard;