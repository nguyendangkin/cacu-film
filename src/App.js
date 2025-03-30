import React, { useState, useEffect } from "react";

function App() {
    const [totalMachines, setTotalMachines] = useState(14);
    const [goodMachines, setGoodMachines] = useState(6);
    const [badMachines, setBadMachines] = useState(8);
    const [goodPrice, setGoodPrice] = useState(1200000);
    const [badPrice, setBadPrice] = useState(600000);
    const [purchasePrice, setPurchasePrice] = useState(2000000);
    const [result, setResult] = useState(null);
    const [sheets, setSheets] = useState(() => {
        const saved = localStorage.getItem("sheets");
        return saved ? JSON.parse(saved) : [];
    });
    const [currentSheet, setCurrentSheet] = useState(null);
    const [sheetName, setSheetName] = useState("");
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [newSheetName, setNewSheetName] = useState("");

    useEffect(() => {
        localStorage.setItem("sheets", JSON.stringify(sheets));
    }, [sheets]);

    const handleSaveSheet = () => {
        const sheetData = {
            id: Date.now(),
            name: sheetName,
            data: {
                totalMachines: Number(totalMachines),
                goodMachines: Number(goodMachines),
                badMachines: Number(badMachines),
                goodPrice: Number(goodPrice),
                badPrice: Number(badPrice),
                purchasePrice: Number(purchasePrice),
                result: result ? JSON.parse(JSON.stringify(result)) : null,
            },
        };

        // Create a completely new array for sheets
        setSheets((prevSheets) => [...prevSheets, sheetData]);
        setCurrentSheet(sheetData.id);
        setShowSaveDialog(false);
        setSheetName("");
    };

    const handleLoadSheet = (sheet) => {
        // Make sure we're using primitive values by explicitly converting to numbers
        setTotalMachines(Number(sheet.data.totalMachines));
        setGoodMachines(Number(sheet.data.goodMachines));
        setBadMachines(Number(sheet.data.badMachines));
        setGoodPrice(Number(sheet.data.goodPrice));
        setBadPrice(Number(sheet.data.badPrice));
        setPurchasePrice(Number(sheet.data.purchasePrice));

        // Deep copy result object
        setResult(
            sheet.data.result
                ? JSON.parse(JSON.stringify(sheet.data.result))
                : null
        );
        setCurrentSheet(sheet.id);
    };

    const handleUpdateSheet = () => {
        const updatedSheets = sheets.map((sheet) => {
            if (sheet.id === currentSheet) {
                // Create completely new data object
                return {
                    ...sheet,
                    data: {
                        totalMachines: Number(totalMachines),
                        goodMachines: Number(goodMachines),
                        badMachines: Number(badMachines),
                        goodPrice: Number(goodPrice),
                        badPrice: Number(badPrice),
                        purchasePrice: Number(purchasePrice),
                        result: result
                            ? JSON.parse(JSON.stringify(result))
                            : null,
                    },
                };
            }
            return sheet;
        });

        // Create a new array for sheets state
        setSheets([...updatedSheets]);
    };

    const handleDeleteSheet = (sheetId) => {
        setSheets(sheets.filter((sheet) => sheet.id !== sheetId));
        if (currentSheet === sheetId) {
            setCurrentSheet(null);
            // Reset to default values
            setTotalMachines(14);
            setGoodMachines(6);
            setBadMachines(8);
            setGoodPrice(1200000);
            setBadPrice(600000);
            setPurchasePrice(2000000);
            setResult(null); // Also reset result
        }
    };

    const handleRenameSheet = () => {
        const updatedSheets = sheets.map((sheet) => {
            if (sheet.id === currentSheet) {
                return {
                    ...sheet,
                    name: newSheetName,
                };
            }
            return sheet;
        });
        setSheets([...updatedSheets]); // Create new array
        setShowRenameDialog(false);
        setNewSheetName("");
    };

    const handleMachineChange = (type, value) => {
        const numValue = Number(value);
        if (type === "good") {
            if (numValue >= 0 && numValue <= totalMachines) {
                setGoodMachines(numValue);
                setBadMachines(totalMachines - numValue);
            }
        } else {
            if (numValue >= 0 && numValue <= totalMachines) {
                setBadMachines(numValue);
                setGoodMachines(totalMachines - numValue);
            }
        }
    };

    const calculateAveragePrice = (
        goodMachines,
        badMachines,
        goodPrice,
        badPrice
    ) => {
        const goodMachinesNum = Number(goodMachines);
        const badMachinesNum = Number(badMachines);
        const goodPriceNum = Number(goodPrice);
        const badPriceNum = Number(badPrice);

        let totalCost =
            goodMachinesNum * goodPriceNum + badMachinesNum * badPriceNum;
        let averagePrice = totalCost / (goodMachinesNum + badMachinesNum);

        return {
            averagePrice: Math.round(averagePrice),
            totalCost: Math.round(totalCost),
        };
    };

    const calculatePricePerMachine = () => {
        if (totalMachines === 0) return 0;
        return Math.round(purchasePrice / totalMachines);
    };

    useEffect(() => {
        let { averagePrice, totalCost } = calculateAveragePrice(
            goodMachines,
            badMachines,
            goodPrice,
            badPrice
        );
        let profit = totalCost - purchasePrice;
        let grossProfitMargin = (profit / totalCost) * 100;
        let pricePerMachine = calculatePricePerMachine();

        setResult({
            totalValue: totalCost,
            averagePrice,
            profit,
            grossProfitMargin,
            pricePerMachine,
        });
    }, [
        goodMachines,
        badMachines,
        goodPrice,
        badPrice,
        purchasePrice,
        totalMachines,
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
            <div style={styles.sheetTags}>
                {sheets.map((sheet) => (
                    <div key={sheet.id} style={styles.sheetTag}>
                        <span
                            onClick={() => handleLoadSheet(sheet)}
                            style={{
                                cursor: "pointer",
                                color:
                                    currentSheet === sheet.id
                                        ? "#007bff"
                                        : "black",
                            }}
                        >
                            {sheet.name}
                        </span>
                        <div style={styles.sheetButtons}>
                            {currentSheet === sheet.id && (
                                <button
                                    onClick={() => {
                                        setNewSheetName(sheet.name);
                                        setShowRenameDialog(true);
                                    }}
                                    style={styles.renameButton}
                                >
                                    ✎
                                </button>
                            )}
                            <button
                                onClick={() => handleDeleteSheet(sheet.id)}
                                style={styles.deleteButton}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h1 style={styles.title}>Tính Toán Lợi Nhuận Lô Máy Ảnh 📷</h1>
            <div style={styles.box}>
                <div style={styles.actions}>
                    <button
                        onClick={() => setShowSaveDialog(true)}
                        style={styles.button}
                    >
                        Lưu Sheet Mới
                    </button>
                    {currentSheet && (
                        <button
                            onClick={handleUpdateSheet}
                            style={{ ...styles.button, marginLeft: "10px" }}
                        >
                            Cập Nhật Sheet
                        </button>
                    )}
                </div>

                {showSaveDialog && (
                    <div style={styles.saveDialog}>
                        <input
                            type="text"
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                            placeholder="Nhập tên sheet"
                            style={styles.input}
                        />
                        <div style={styles.dialogButtons}>
                            <button
                                onClick={handleSaveSheet}
                                style={styles.button}
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => setShowSaveDialog(false)}
                                style={{ ...styles.button, marginLeft: "10px" }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}

                {showRenameDialog && (
                    <div style={styles.saveDialog}>
                        <input
                            type="text"
                            value={newSheetName}
                            onChange={(e) => setNewSheetName(e.target.value)}
                            placeholder="Nhập tên mới"
                            style={styles.input}
                        />
                        <div style={styles.dialogButtons}>
                            <button
                                onClick={handleRenameSheet}
                                style={styles.button}
                            >
                                Đổi tên
                            </button>
                            <button
                                onClick={() => setShowRenameDialog(false)}
                                style={{ ...styles.button, marginLeft: "10px" }}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                )}

                <InputField
                    label="Tổng số máy"
                    value={totalMachines}
                    setValue={setTotalMachines}
                    isPrice={false}
                />
                <InputField
                    label="Số máy tốt"
                    value={goodMachines}
                    setValue={(value) => handleMachineChange("good", value)}
                    isPrice={false}
                    max={totalMachines}
                    linkedValue={badMachines}
                />
                <InputField
                    label="Số máy xấu"
                    value={badMachines}
                    setValue={(value) => handleMachineChange("bad", value)}
                    isPrice={false}
                    max={totalMachines}
                    linkedValue={goodMachines}
                />
                <InputField
                    label="Giá sàn cho máy tốt (VND)"
                    value={goodPrice}
                    setValue={setGoodPrice}
                    isPrice={true}
                />
                <InputField
                    label="Giá sàn máy xấu (VND)"
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

                {result && (
                    <div style={styles.resultBox}>
                        <p>
                            📌 <b>Giá cuối khi Lô về tay:</b>{" "}
                            {formatCurrency(purchasePrice)} VND
                        </p>
                        <p>
                            💵 <b>Giá mỗi máy khi về tay:</b>{" "}
                            {formatCurrency(result.pricePerMachine)} VND
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
                    </div>
                )}
            </div>
        </div>
    );
}

function InputField({ label, value, setValue, isPrice, max, linkedValue }) {
    const [inputValue, setInputValue] = useState(
        isPrice ? value.toLocaleString("vi-VN") : value.toString()
    );

    useEffect(() => {
        // Update local state when props change
        if (isPrice) {
            setInputValue(Number(value).toLocaleString("vi-VN"));
        } else {
            setInputValue(value.toString());
        }
    }, [value, isPrice, linkedValue]);

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
            setInputValue(Number(value).toLocaleString("vi-VN"));
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
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },
    resultBox: {
        marginTop: "15px",
        padding: "10px",
        backgroundColor: "#e9ecef",
        borderRadius: "5px",
    },
    sheetTags: {
        position: "fixed",
        top: "20px",
        left: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    sheetTag: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: "5px 10px",
        borderRadius: "5px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        width: "200px",
    },
    sheetButtons: {
        display: "flex",
        gap: "5px",
    },
    deleteButton: {
        border: "none",
        background: "none",
        color: "red",
        cursor: "pointer",
        fontSize: "16px",
        padding: "0 5px",
    },
    renameButton: {
        border: "none",
        background: "none",
        color: "#007bff",
        cursor: "pointer",
        fontSize: "14px",
        padding: "0 5px",
    },
    actions: {
        display: "flex",
        marginBottom: "20px",
    },
    saveDialog: {
        marginTop: "10px",
        marginBottom: "20px",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "5px",
    },
    dialogButtons: {
        display: "flex",
        marginTop: "10px",
    },
};

export default App;
