import React, { useState, useEffect } from "react";

function App() {
    const [totalMachines, setTotalMachines] = useState(() => {
        const saved = localStorage.getItem("totalMachines");
        return saved ? Number(saved) : 14;
    });
    const [goodRatio, setGoodRatio] = useState(() => {
        const saved = localStorage.getItem("goodRatio");
        return saved ? Number(saved) : 4;
    });
    const [badRatio, setBadRatio] = useState(() => {
        const saved = localStorage.getItem("badRatio");
        return saved ? Number(saved) : 6;
    });
    const [goodPrice, setGoodPrice] = useState(() => {
        const saved = localStorage.getItem("goodPrice");
        return saved ? Number(saved) : 1200000;
    });
    const [badPrice, setBadPrice] = useState(() => {
        const saved = localStorage.getItem("badPrice");
        return saved ? Number(saved) : 600000;
    });
    const [purchasePrice, setPurchasePrice] = useState(() => {
        const saved = localStorage.getItem("purchasePrice");
        return saved ? Number(saved) : 2000000;
    });
    const [result, setResult] = useState(null);

    // Lưu giá trị vào localStorage khi thay đổi
    useEffect(() => {
        localStorage.setItem("totalMachines", totalMachines);
        localStorage.setItem("goodRatio", goodRatio);
        localStorage.setItem("badRatio", badRatio);
        localStorage.setItem("goodPrice", goodPrice);
        localStorage.setItem("badPrice", badPrice);
        localStorage.setItem("purchasePrice", purchasePrice);
    }, [
        totalMachines,
        goodRatio,
        badRatio,
        goodPrice,
        badPrice,
        purchasePrice,
    ]);

    // Xử lý thay đổi tỷ lệ
    const handleRatioChange = (type, value) => {
        const numValue = Number(value);
        if (type === "good") {
            if (numValue >= 0 && numValue <= 10) {
                setGoodRatio(numValue);
                setBadRatio(10 - numValue);
            }
        } else {
            if (numValue >= 0 && numValue <= 10) {
                setBadRatio(numValue);
                setGoodRatio(10 - numValue);
            }
        }
    };

    // Tính giá trung bình mỗi máy
    const calculateAveragePrice = (
        total,
        goodRatio,
        badRatio,
        goodPrice,
        badPrice
    ) => {
        // Đảm bảo các số là number
        const totalNum = Number(total);
        const goodRatioNum = Number(goodRatio);
        const badRatioNum = Number(badRatio);
        const goodPriceNum = Number(goodPrice);
        const badPriceNum = Number(badPrice);

        // Tính số lượng máy
        let goodMachines =
            totalNum * (goodRatioNum / (goodRatioNum + badRatioNum));
        let badMachines =
            totalNum * (badRatioNum / (goodRatioNum + badRatioNum));

        // Tính giá trị
        let totalCost = goodMachines * goodPriceNum + badMachines * badPriceNum;
        let averagePrice = totalCost / totalNum;

        // Làm tròn để tránh lỗi số thập phân
        return {
            averagePrice: Math.round(averagePrice),
            totalCost: Math.round(totalCost),
        };
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
        if (!number) return "0";
        if (typeof number !== "number") return "0";
        return Math.round(number)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
                    label="Tỷ lệ máy tốt (tổng 10)"
                    value={goodRatio}
                    setValue={(value) => handleRatioChange("good", value)}
                    isPrice={false}
                    max={10}
                    linkedValue={badRatio}
                />
                <InputField
                    label="Tỷ lệ máy xấu (tổng 10)"
                    value={badRatio}
                    setValue={(value) => handleRatioChange("bad", value)}
                    isPrice={false}
                    max={10}
                    linkedValue={goodRatio}
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
function InputField({ label, value, setValue, isPrice, max, linkedValue }) {
    const [inputValue, setInputValue] = useState(
        isPrice ? value.toLocaleString("vi-VN") : value.toString()
    );

    useEffect(() => {
        if (linkedValue !== undefined) {
            setInputValue(value.toString());
        }
    }, [linkedValue, value]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const rawValue = newValue.replace(/\./g, "");
        if (!isNaN(rawValue) && rawValue !== "") {
            if (max && Number(rawValue) > max) {
                setValue(max);
            } else {
                setValue(Number(rawValue));
            }
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
