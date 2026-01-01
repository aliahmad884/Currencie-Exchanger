import { useEffect, useState } from "react"
import countryList from "../dataScript/codes"
import countries from "../dataScript/country";
import currencyCode from "../dataScript/currency";


export default function Layout() {
    const [toFlag, setToFlag] = useState('PK');
    const [fromFlag, setFromFlag] = useState('US');
    const [toCurrency, setToCurrency] = useState('pkr');
    const [fromCurrency, setFromCurrency] = useState('usd');
    const [display, setDisplay] = useState();
    const [amount, setAmount] = useState();
    const [rate, setRate] = useState({
        exRate: '',
        cur: '',
        exDate: '',
        fromCountry: '',
        toCountry: ''
    });

    // let baseUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency}/${toCurrency}.json`
    let baseUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`;
    const fetchRate = async () => {
        try {
            const res = await fetch(baseUrl);
            const result = await res.json();
            const exRate = result[fromCurrency][toCurrency].toFixed(3)
            setRate({
                exRate,
                cur: countries[toFlag].symbol,
                exDate: result['date'],
                fromCountry: `${countries[fromFlag].name}-${countries[fromFlag].symbol}`,
                toCountry: `${countries[toFlag].name}-${countries[toFlag].symbol}`
            })
            setDisplay(exRate * amount)
        }
        catch (err) { console.error(err) }
    }

    useEffect(
        () => {
            fetchRate()
        },
        [toFlag, fromFlag, amount]
    )


    const createToStr = (str) => {
        let cr = currencyCode[str].toLowerCase();
        setToFlag(str)
        setToCurrency(cr)
    }

    const createFromStr = (str) => {
        let cr = currencyCode[str].toLowerCase();
        console.log(cr)
        setFromFlag(str)
        setFromCurrency(cr)
    }

    const handleSwitch = () => {
        let from = fromCurrency;
        let fromF = fromFlag;
        setFromFlag(toFlag)
        setFromCurrency(toCurrency);
        setToFlag(fromF)
        setToCurrency(from)
        // console.log("To Currency: ", toCurrency)
        // console.log("From Currency: ", fromCurrency)
        // console.log()
    }

    let toFlagUrl = `https://flagsapi.com/${toFlag}/flat/64.png`
    let fromFlagUrl = `https://flagsapi.com/${fromFlag}/flat/64.png`

    return (

        <div className="flex justify-center items-center p-2 h-full w-full">
            {/* <h1 className="font-sans text-2xl subpixel-antialiased font-medium">Simple Currency Converter</h1> */}
            <div className="bg-white w-full max-w-[370px] h-full max-h-[90vh] border-t-8 rounded-lg border-blue-500 shadow-xl py-10">
                <h1 className="text-center text-slate-500">Exchange Rate</h1>
                <h1 className="text-center mt-2 text-lg"><strong>{amount ? amount : 1}</strong> {rate.fromCountry} <strong>In</strong> {rate.toCountry}</h1>
                <h1 className="text-center mt-3 text-3xl font-bold">{rate.cur}{display ? display.toFixed(3) : rate.exRate}</h1>
                <h1 className="text-center mt-2 text-xl">{new Date(rate.exDate).toDateString()}</h1>

                <div className="grid place-items-center mt-12 mx-2">
                    <form>
                        <div className="">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Amount</label>
                            <input min={1} defaultValue={1} id="amountIn" onChange={(e) => setAmount(e.target.value)} type="number" className="block w-80 rounded-sm border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        </div>

                        <div className="mt-4 flex flex-col w-full items-center">
                            <div className="flex flex-col w-full">
                                <label className="block text-sm font-medium text-gray-900">From</label>
                                <div className="flex flex-row border">
                                    <img src={fromFlagUrl} alt="flag" width={40} />
                                    <select value={fromFlag} onChange={(e) => createFromStr(e.target.value)} className="py-1.5 rounded-sm w-full outline-none">
                                        {
                                            countryList.map(code => <option key={code.Flag} value={code.Flag}>{code.Country}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            
                            <img src="./assets/arrow.png" className="w-8 h-7 mt-7 cursor-pointer" onClick={handleSwitch} alt="Converter" />

                            <div className="flex flex-col w-full">
                                <label className="block text-sm font-medium text-gray-900">To</label>
                                <div className="flex flex-row border">
                                    <img src={toFlagUrl} alt="flag" width={40} />
                                    <select value={toFlag} onChange={(e) => createToStr(e.target.value)} className="py-1.5 rounded-sm w-full outline-none">
                                        {
                                            countryList.map(code =>
                                                <option key={code.Flag} value={code.Flag}>{code.Country}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* <div className="pl-2">
                            <input type="button" value="Convert" className="w-80 bg-blue-500 rounded-sm cursor-pointer text-white py-2 mt-8 mb-16" />
                        </div> */}
                    </form>
                </div>
            </div >
        </div >
    )
}