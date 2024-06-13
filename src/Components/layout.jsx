import { useEffect, useState } from "react"
import countryList from "../dataScript/codes"
import countries from "../dataScript/country";
import currencyCode from "../dataScript/currency";


export default function Layout() {
    const [toFlag, setToFlag] = useState('PK');
    const [fromFlag, setFromFlag] = useState('US');
    const [getData, updateData] = useState(false)
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
    useEffect(
        () => {
            fetch(baseUrl)
                .then(response => response.json())
                .then(result => {
                    setRate({
                        exRate: result[fromCurrency][toCurrency].toFixed(3),
                        cur: countries[toFlag].symbol,
                        exDate: result['date'],
                        fromCountry: `${countries[fromFlag].name}-${countries[fromFlag].symbol}`,
                        toCountry: `${countries[toFlag].name}-${countries[toFlag].symbol}`
                    })
                })
                .catch(err => console.log(err))
        }, [getData, toFlag, fromFlag])


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

    const handleAmount = () => {
        let elt = document.getElementById("amountIn");
        elt.value = 1;
        let amt = rate.exRate * amount;
        setDisplay(amt);
    }

    let toFlagUrl = `https://flagsapi.com/${toFlag}/flat/64.png`
    let fromFlagUrl = `https://flagsapi.com/${fromFlag}/flat/64.png`

    return (

        <div className="grid place-items-center mt-32">
            <h1 className="font-sans text-2xl subpixel-antialiased font-medium">Simple Currency Converter</h1>
            <div className="bg-white w-96 h-full border-t-8 border-blue-500 mt-10 shadow-xl">
                <h1 className="text-center mt-9 text-slate-500">Exchange Rate</h1>
                <h1 className="text-center mt-2 text-lg"><strong>{amount ? amount : 1}</strong> {rate.fromCountry} <strong>In</strong> {rate.toCountry}</h1>
                <h1 className="text-center mt-3 text-3xl font-bold">{rate.cur}{display ? display.toFixed(3) : rate.exRate}</h1>
                <h1 className="text-center mt-2 text-xl">{new Date(rate.exDate).toDateString()}</h1>

                <div className="grid place-items-center mt-12 mx-2">
                    <form>
                        <div className="pl-2">
                            <label className="block text-sm font-medium leading-6 text-gray-900">Amount</label>
                            <input defaultValue={1} id="amountIn" onChange={(e) => setAmount(e.target.value)} type="text" className="block w-80 rounded-sm border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00" />
                        </div>
                        <div className="grid grid-cols-3 mt-4 ">

                            <div className="block px-1  grid grid-cols-2">
                                <div className="w-10">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">From</label>
                                    <img src={fromFlagUrl} alt="flag" />
                                </div>
                                <div>
                                    <select defaultValue={"US"} onClick={(e) => createFromStr(e.target.value)} className="w-full py-1.5 mt-6 rounded-sm ">
                                        {
                                            countryList.map(code => <option key={code.Flag} value={code.Flag}>{code.Flag}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="flex align-center justify-center">
                                <img src="./assets/arrow.png" className="w-8 h-7 mt-7" alt="Converter" />
                            </div>

                            <div className="block px-1  grid grid-cols-2">
                                <div className="w-10">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">To</label>
                                    <img src={toFlagUrl} alt="flag" />
                                </div>
                                <div>
                                    <select defaultValue={"PK"} onClick={(e) => createToStr(e.target.value)} className="w-full py-1.5 mt-6 rounded-sm ">
                                        {
                                            countryList.map(code =>
                                                <option key={code.Flag} value={code.Flag}>{code.Flag}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div className="pl-2">
                            <input type="button" value="Convert" onClick={() => {
                                updateData(!getData)
                                handleAmount()
                            }} className="w-80 bg-red-500 rounded-sm cursor-pointer text-white py-2 mt-8 mb-16" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}