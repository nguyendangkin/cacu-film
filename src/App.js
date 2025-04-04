import React, { useState, useEffect } from "react";

function App() {
    // Default percentages for machine types
    const defaultPercentages = {
        good: 25,
        minorIssue: 45,
        bad: 30,
    };

    const [totalMachines, setTotalMachines] = useState(26);
    const [goodMachines, setGoodMachines] = useState(
        (26 * defaultPercentages.good) / 100
    );
    const [minorIssueMachines, setMinorIssueMachines] = useState(
        (26 * defaultPercentages.minorIssue) / 100
    );
    const [badMachines, setBadMachines] = useState(
        (26 * defaultPercentages.bad) / 100
    );
    const [goodPrice, setGoodPrice] = useState(1100000);
    const [minorIssuePrice, setMinorIssuePrice] = useState(800000);
    const [badPrice, setBadPrice] = useState(500000);
    const [purchasePrice, setPurchasePrice] = useState(4500000);
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
                minorIssueMachines: Number(minorIssueMachines),
                badMachines: Number(badMachines),
                goodPrice: Number(goodPrice),
                minorIssuePrice: Number(minorIssuePrice),
                badPrice: Number(badPrice),
                purchasePrice: Number(purchasePrice),
                result: result ? JSON.parse(JSON.stringify(result)) : null,
            },
        };

        setSheets((prevSheets) => [...prevSheets, sheetData]);
        setCurrentSheet(sheetData.id);
        setShowSaveDialog(false);
        setSheetName("");
    };

    const handleLoadSheet = (sheet) => {
        setTotalMachines(Number(sheet.data.totalMachines));
        setGoodMachines(Number(sheet.data.goodMachines));
        setMinorIssueMachines(Number(sheet.data.minorIssueMachines || 0));
        setBadMachines(Number(sheet.data.badMachines));
        setGoodPrice(Number(sheet.data.goodPrice));
        setMinorIssuePrice(Number(sheet.data.minorIssuePrice || 800000));
        setBadPrice(Number(sheet.data.badPrice));
        setPurchasePrice(Number(sheet.data.purchasePrice));

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
                return {
                    ...sheet,
                    data: {
                        totalMachines: Number(totalMachines),
                        goodMachines: Number(goodMachines),
                        minorIssueMachines: Number(minorIssueMachines),
                        badMachines: Number(badMachines),
                        goodPrice: Number(goodPrice),
                        minorIssuePrice: Number(minorIssuePrice),
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

        setSheets([...updatedSheets]);
    };

    const handleDeleteSheet = (sheetId) => {
        setSheets(sheets.filter((sheet) => sheet.id !== sheetId));
        if (currentSheet === sheetId) {
            setCurrentSheet(null);
            // Reset to default values
            setTotalMachines(26);
            setGoodMachines((26 * defaultPercentages.good) / 100);
            setMinorIssueMachines((26 * defaultPercentages.minorIssue) / 100);
            setBadMachines((26 * defaultPercentages.bad) / 100);
            setGoodPrice(1200000);
            setMinorIssuePrice(800000);
            setBadPrice(400000);
            setPurchasePrice(3000000);
            setResult(null);
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
        setSheets([...updatedSheets]);
        setShowRenameDialog(false);
        setNewSheetName("");
    };

    const handleTotalMachinesChange = (value) => {
        const numValue = Number(value);
        if (numValue >= 0) {
            // Apply the fixed percentages to the new total
            const newGood = (numValue * defaultPercentages.good) / 100;
            const newMinorIssue =
                (numValue * defaultPercentages.minorIssue) / 100;
            const newBad = (numValue * defaultPercentages.bad) / 100;

            setTotalMachines(numValue);
            setGoodMachines(newGood);
            setMinorIssueMachines(newMinorIssue);
            setBadMachines(newBad);
        }
    };

    const handleMachineChange = (type, value) => {
        const numValue = Number(value);
        if (numValue < 0) return;

        if (type === "good") {
            if (numValue <= totalMachines) {
                // If new good count is valid
                const remainingForOthers = totalMachines - numValue;
                // Keep the ratio between minor issues and bad machines
                const totalOthers = minorIssueMachines + badMachines;
                if (totalOthers === 0) {
                    // If there are no others, split evenly
                    setMinorIssueMachines(Math.round(remainingForOthers / 2));
                    setBadMachines(
                        remainingForOthers - Math.round(remainingForOthers / 2)
                    );
                } else {
                    // Otherwise maintain the ratio
                    const minorIssueRatio = minorIssueMachines / totalOthers;
                    const newMinorIssue = Math.round(
                        remainingForOthers * minorIssueRatio
                    );
                    setMinorIssueMachines(newMinorIssue);
                    setBadMachines(remainingForOthers - newMinorIssue);
                }
                setGoodMachines(numValue);
            }
        } else if (type === "minorIssue") {
            if (numValue <= totalMachines) {
                const remainingForOthers =
                    totalMachines - numValue - goodMachines;
                if (remainingForOthers >= 0) {
                    setBadMachines(remainingForOthers);
                    setMinorIssueMachines(numValue);
                } else {
                    // If not enough remaining, adjust good machines
                    const possible = totalMachines - goodMachines;
                    setMinorIssueMachines(possible);
                    setBadMachines(0);
                }
            }
        } else if (type === "bad") {
            if (numValue <= totalMachines) {
                const remainingForOthers =
                    totalMachines - numValue - goodMachines;
                if (remainingForOthers >= 0) {
                    setMinorIssueMachines(remainingForOthers);
                    setBadMachines(numValue);
                } else {
                    // If not enough remaining, adjust good machines
                    const possible = totalMachines - goodMachines;
                    setBadMachines(possible);
                    setMinorIssueMachines(0);
                }
            }
        }
    };

    const calculateAveragePrice = () => {
        const goodMachinesNum = Number(goodMachines);
        const minorIssueMachinesNum = Number(minorIssueMachines);
        const badMachinesNum = Number(badMachines);
        const goodPriceNum = Number(goodPrice);
        const minorIssuePriceNum = Number(minorIssuePrice);
        const badPriceNum = Number(badPrice);

        const goodValue = goodMachinesNum * goodPriceNum;
        const minorIssueValue = minorIssueMachinesNum * minorIssuePriceNum;
        const badValue = badMachinesNum * badPriceNum;
        const totalCost = goodValue + minorIssueValue + badValue;

        const totalMachinesNum =
            goodMachinesNum + minorIssueMachinesNum + badMachinesNum;
        const averagePrice =
            totalMachinesNum > 0 ? totalCost / totalMachinesNum : 0;

        return {
            averagePrice: Math.round(averagePrice),
            totalCost: Math.round(totalCost),
            goodValue: Math.round(goodValue),
            minorIssueValue: Math.round(minorIssueValue),
            badValue: Math.round(badValue),
        };
    };

    const calculatePricePerMachine = () => {
        if (totalMachines === 0) return 0;
        return Math.round(purchasePrice / totalMachines);
    };

    useEffect(() => {
        // Update calculations whenever any input changes
        const calculationResults = calculateAveragePrice();
        const profit = calculationResults.totalCost - purchasePrice;
        const grossProfitMargin =
            calculationResults.totalCost > 0
                ? (profit / calculationResults.totalCost) * 100
                : 0;
        const pricePerMachine = calculatePricePerMachine();

        // Calculate percentages for each machine type
        const goodPercentage =
            totalMachines > 0 ? (goodMachines / totalMachines) * 100 : 0;
        const minorIssuePercentage =
            totalMachines > 0 ? (minorIssueMachines / totalMachines) * 100 : 0;
        const badPercentage =
            totalMachines > 0 ? (badMachines / totalMachines) * 100 : 0;

        setResult({
            ...calculationResults,
            profit,
            grossProfitMargin,
            pricePerMachine,
            goodPercentage,
            minorIssuePercentage,
            badPercentage,
        });
    }, [
        goodMachines,
        minorIssueMachines,
        badMachines,
        goodPrice,
        minorIssuePrice,
        badPrice,
        purchasePrice,
        totalMachines,
    ]);

    const formatCurrency = (number) => {
        if (!number && number !== 0) return "0";
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

            <h1 style={styles.title}>Tính Toán Lợi Nhuận Lô Máy Ảnh Film 📷</h1>
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
                    setValue={handleTotalMachinesChange}
                    isPrice={false}
                />

                <div style={styles.machineTypesContainer}>
                    <h3 style={styles.sectionTitle}>
                        Phân Loại Chất Lượng Máy:
                    </h3>

                    <div style={styles.machineTypeRow}>
                        <InputField
                            label="Máy được giá tốt"
                            value={goodMachines}
                            setValue={(value) =>
                                handleMachineChange("good", value)
                            }
                            isPrice={false}
                            max={totalMachines}
                        />
                        <div style={styles.percentage}>
                            {result && `${result.goodPercentage.toFixed(1)}%`}
                        </div>
                    </div>

                    <div style={styles.machineTypeRow}>
                        <InputField
                            label="Máy lỗi được giá trung bình"
                            value={minorIssueMachines}
                            setValue={(value) =>
                                handleMachineChange("minorIssue", value)
                            }
                            isPrice={false}
                            max={totalMachines}
                        />
                        <div style={styles.percentage}>
                            {result &&
                                `${result.minorIssuePercentage.toFixed(1)}%`}
                        </div>
                    </div>

                    <div style={styles.machineTypeRow}>
                        <InputField
                            label="Máy xác"
                            value={badMachines}
                            setValue={(value) =>
                                handleMachineChange("bad", value)
                            }
                            isPrice={false}
                            max={totalMachines}
                        />
                        <div style={styles.percentage}>
                            {result && `${result.badPercentage.toFixed(1)}%`}
                        </div>
                    </div>
                </div>

                <h3 style={styles.sectionTitle}>Giá Bán Ước Tính:</h3>
                <InputField
                    label="Giá máy tốt (VND)"
                    value={goodPrice}
                    setValue={setGoodPrice}
                    isPrice={true}
                />
                <InputField
                    label="Giá máy trung bình (VND)"
                    value={minorIssuePrice}
                    setValue={setMinorIssuePrice}
                    isPrice={true}
                />
                <InputField
                    label="Giá máy hỏng (VND)"
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
                        <h3 style={styles.resultTitle}>Kết Quả Phân Tích</h3>

                        <p>
                            📌 <b>Giá mua lô:</b>{" "}
                            {formatCurrency(purchasePrice)} VND
                        </p>
                        <p>
                            💵 <b>Giá trung bình mỗi máy khi mua:</b>{" "}
                            {formatCurrency(result.pricePerMachine)} VND
                        </p>

                        <div style={styles.separator}></div>

                        <p>
                            🔹 <b>Tổng giá trị khi bán:</b>{" "}
                            {formatCurrency(result.totalCost)} VND
                        </p>
                        <div style={styles.valueBreakdown}>
                            <p>
                                ✓ Giá trị máy tốt:{" "}
                                {formatCurrency(result.goodValue)} VND
                            </p>
                            <p>
                                ✓ Giá trị máy lỗi nhẹ:{" "}
                                {formatCurrency(result.minorIssueValue)} VND
                            </p>
                            <p>
                                ✓ Giá trị máy hỏng:{" "}
                                {formatCurrency(result.badValue)} VND
                            </p>
                        </div>

                        <p>
                            📉 <b>Giá trung bình khi bán:</b>{" "}
                            {formatCurrency(result.averagePrice)} VND
                        </p>

                        <div style={styles.separator}></div>

                        <p
                            style={
                                result.profit >= 0
                                    ? styles.profitPositive
                                    : styles.profitNegative
                            }
                        >
                            💰 <b>Lợi nhuận gộp:</b>{" "}
                            {formatCurrency(result.profit)} VND
                        </p>
                        <p
                            style={
                                result.grossProfitMargin >= 0
                                    ? styles.profitPositive
                                    : styles.profitNegative
                            }
                        >
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

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        // Không format số ngay lập tức khi đang nhập
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

    // Chỉ format khi người dùng rời khỏi input
    const handleBlur = () => {
        if (isPrice) {
            setInputValue(Number(value).toLocaleString("vi-VN"));
        } else {
            setInputValue(value.toString());
        }
    };

    // Cập nhật giá trị hiển thị khi value thay đổi từ bên ngoài
    useEffect(() => {
        if (isPrice) {
            setInputValue(Number(value).toLocaleString("vi-VN"));
        } else {
            setInputValue(value.toString());
        }
    }, [value, isPrice]);

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
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: "16px",
        marginTop: "15px",
        marginBottom: "10px",
        fontWeight: "bold",
        borderBottom: "1px solid #eee",
        paddingBottom: "5px",
    },
    box: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "400px",
        maxWidth: "100%",
    },
    inputContainer: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px",
        flex: 1,
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
        marginTop: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
    },
    resultTitle: {
        fontSize: "18px",
        marginTop: "0",
        marginBottom: "15px",
        textAlign: "center",
        color: "#007bff",
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
        justifyContent: "center",
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
    machineTypesContainer: {
        marginBottom: "15px",
    },
    machineTypeRow: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    percentage: {
        marginLeft: "10px",
        backgroundColor: "#e9ecef",
        padding: "5px 8px",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: "bold",
        minWidth: "50px",
        textAlign: "center",
    },
    separator: {
        height: "1px",
        backgroundColor: "#dee2e6",
        margin: "15px 0",
    },
    valueBreakdown: {
        paddingLeft: "20px",
        fontSize: "14px",
        color: "#6c757d",
    },
    profitPositive: {
        color: "#28a745",
        fontWeight: "bold",
    },
    profitNegative: {
        color: "#dc3545",
        fontWeight: "bold",
    },
};

export default App;
