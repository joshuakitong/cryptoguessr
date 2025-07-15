export default function CryptoCompareBox({ coin, onClick, revealed, metric }) {
  const value = coin?.[metric];

  return (
    <button
      onClick={onClick}
      disabled={revealed}
      className={`bg-[#1c1f26] hover:bg-[#2a2d34] text-white border border-white 
        overflow-hidden rounded-lg h-60 sm:h-96 w-42 sm:w-72 
        flex flex-col items-center transition duration-300 ease-in-out 
        ${revealed ? 'cursor-default opacity-80' : 'cursor-pointer'}
      `}
    >
      <img src={coin.image} alt={coin.name} className="w-full min-w-42 h-42 sm:h-72 mb-4 object-contain" />
      <h3 className="font-semibold text-lg truncate px-2 w-full text-center" title={coin.name}>
        {coin.name}
      </h3>

      {revealed && (
        <p className="mt-2 text-[#f7931a] font-bold text-xl">
          {typeof value === "number" ? `${value.toFixed(2)}${metric.includes("price_change") ? "%" : "$"}` : "N/A"}
        </p>
      )}
    </button>
  );
}
