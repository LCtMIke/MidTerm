export const getStockInfo = async (stockCode) => {
  try {
    const response = await fetch(X
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=BYT5TYE9HLN5J1KJ`,
    );
    const json = await response.json();
    return json['Global Quote']['10. change percent'];
  } catch (error) {
        console.error("Lỗi", error);
        // Hiển thị thông báo lỗi
        return "Lỗi";
      }
};
