import React, { useState, useEffect } from "react";

function App() {
    const [totalMachines, setTotalMachines] = useState(14);
    const [goodRatio, setGoodRatio] = useState(4);
    const [badRatio, setBadRatio] = useState(6);
    const [goodPrice, setGoodPrice] = useState(1200000);
    const [badPrice, setBadPrice] = useState(600000);
    const [purchasePrice, setPurchasePrice] = useState(2000000);
    const [result, setResult] = useState(null);

    // Tính giá trung bình mỗi máy
    const calculateAveragePrice = (
        total,
        goodRatio,
        badRatio,
        goodPrice,
        badPrice
    ) => {
        let goodMachines = total * (goodRatio / (goodRatio + badRatio));
        let badMachines = total * (badRatio / (goodRatio + badRatio));

        let totalCost = goodMachines * goodPrice + badMachines * badPrice;
        let averagePrice = totalCost / total;

        return { averagePrice, totalCost };
    };

    useEffect(() => {
        let { averagePrice, totalCost } = calculateAveragePrice(
            totalMachines,
            goodRatio,
            badRatio,
            goodPrice,
            badPrice
        );
        let profit = totalCost - purchasePrice;
        let grossProfitMargin = (profit / totalCost) * 100;

        setResult({
            totalValue: totalCost,
            averagePrice,
            profit,
            grossProfitMargin,
            isProfitable: profit > 0,
        });
    }, [
        totalMachines,
        goodRatio,
        badRatio,
        goodPrice,
        badPrice,
        purchasePrice,
    ]);

    const formatCurrency = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Tính Toán Lợi Nhuận Lô Máy Ảnh 📷</h1>
            <div style={styles.box}>
                {/* Các ô nhập liệu */}
                <InputField
                    label="Tổng số máy"
                    value={totalMachines}
                    setValue={setTotalMachines}
                    isPrice={false}
                />
                <InputField
                    label="Tỷ lệ máy tốt"
                    value={goodRatio}
                    setValue={setGoodRatio}
                    isPrice={false}
                />
                <InputField
                    label="Tỷ lệ máy xấu"
                    value={badRatio}
                    setValue={setBadRatio}
                    isPrice={false}
                />
                <InputField
                    label="Giá cứng máy tốt (VND)"
                    value={goodPrice}
                    setValue={setGoodPrice}
                    isPrice={true}
                />
                <InputField
                    label="Giá cứng máy xấu (VND)"
                    value={badPrice}
                    setValue={setBadPrice}
                    isPrice={true}
                />
                <InputField
                    label="Giá mua lô (VND)"
                    value={purchasePrice}
                    setValue={setPurchasePrice}
                    isPrice={true}
                />

                {/* Hiển thị kết quả */}
                {result && (
                    <div style={styles.resultBox}>
                        <p>
                            📌 <b>Giá cuối khi Lô về tay:</b>{" "}
                            {formatCurrency(purchasePrice)} VND
                        </p>
                        <p>
                            🔹 <b>Tổng giá trị thực:</b>{" "}
                            {formatCurrency(result.totalValue)} VND
                        </p>
                        <p>
                            📉 <b>Giá trung bình mỗi máy:</b>{" "}
                            {formatCurrency(result.averagePrice)} VND
                        </p>
                        <p>
                            💰 <b>Lợi nhuận gộp:</b>{" "}
                            {formatCurrency(result.profit)} VND
                        </p>
                        <p>
                            📊 <b>Tỷ suất lợi nhuận gộp:</b>{" "}
                            {result.grossProfitMargin.toFixed(2)}%
                        </p>
                        <p
                            style={{
                                fontWeight: "bold",
                                color: result.isProfitable ? "green" : "red",
                            }}
                        >
                            {result.isProfitable
                                ? "✅ Đáng mua!"
                                : "❌ Không đáng mua!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Component nhập liệu
function InputField({ label, value, setValue, isPrice }) {
    const [inputValue, setInputValue] = useState(
        isPrice ? value.toLocaleString("vi-VN") : value.toString()
    );

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const rawValue = newValue.replace(/\./g, "");
        if (!isNaN(rawValue) && rawValue !== "") {
            setValue(Number(rawValue));
        }
    };

    const handleBlur = () => {
        if (isPrice) {
            setInputValue(value.toLocaleString("vi-VN"));
        } else {
            setInputValue(value.toString());
        }
    };

    return (
        <div style={styles.inputContainer}>
            <label>{label}</label>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                style={styles.input}
            />
        </div>
    );
}

// CSS inline
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
    },
    title: { fontSize: "24px", fontWeight: "bold", marginBottom: "20px" },
    box: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "350px",
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px",
    },
    input: {
        padding: "8px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        marginTop: "5px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    resultBox: {
        marginTop: "15px",
        padding: "10px",
        backgroundColor: "#e9ecef",
        borderRadius: "5px",
    },
};

export default App;
