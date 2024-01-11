import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import presidency_logo from './assets/presidency_logo.png';
import send_svg from './assets/send.svg';
import { TransformedItems } from "./dropdown";

const socket = io('http://127.0.0.1:5000');

function App() {
  const [text, setText] = useState('');
  const [chatMessage, setChatMessage] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('eng');
  const bottomRef = useRef(null);

  const dropdownItems = useMemo(() => TransformedItems(), []);

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Kannada', value: 'kn' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Malayalam', value: 'ml' },
    { label: 'Telugu', value: 'te' },
    { label: 'Tamil', value: 'ta' }
  ];

  const socketEmit = () => {
    let temp = {
      message: text,
      self: true
    };
    setChatMessage((prev) => [...prev, temp]);
    socket.emit('message', {
      message: text,
      language: selectedLanguage
    });
    setText('');
  };

  useEffect(() => {
    socket.on('recv_message', (data) => {
      let temp = {
        message: data,
        self: false
      };
      setChatMessage((prev) => [...prev, temp]);
    });

    return () => {
      socket.off('recv_message');
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [chatMessage]);

  return (
    <div className="App flex flex-col w-full h-screen items-center text-white">
      <nav className='w-full py-5 flex justify-between items-center z-20'>
        <div className="flex items-center">
          <a href="https://presidencyuniversity.in/" target="_blank"><img className='h-14' src={presidency_logo} alt="Presidency University Logo"/></a>
        </div>

        <div className="language-selection flex items-center">
          {languageOptions.map((option) => (
            <label key={option.value} className="mx-2">
              <input
                type="radio"
                value={option.value}
                checked={selectedLanguage === option.value}
                onChange={() => setSelectedLanguage(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </nav>

      <div id='back-ball' className='absolute rounded-full bg-purple-500/40'></div>
      <div id='back-ball-2' className='absolute rounded-full bg-sky-400/50'></div>
      <div id='backdrop' className='w-screen h-screen fixed z-10'></div>

      <div className="flex flex-col h-3/4 w-4/5 xl:w-2/4 bg-black/40 backdrop-blur-md z-20 rounded-3xl border-2 border-zinc-900/50">
        <div className="heading py-2 px-8 flex items-center border-b-2 border-zinc-500/30">
          <img className='w-16' src="https://media.tenor.com/OjxR-mgQmNoAAAAi/vutura-chatbot.gif" />
          <p className='ml-4 text-2xl font-anton'>Multi Lan </p>
        </div>
        

        <div id='chatscreen' className="flex flex-col w-full h-full overflow-auto px-8 py-5">
        <div class="max-w-3/4 py-1 px-3 font-poppins text-lg rounded-3xl bg-slate-600 text-white mr-auto my-2"  >
                     Hey, I am Multi Lan, an AI assistant here to help you!!
        </div>
          {
            chatMessage.map((item, key) => {
              return (
                <div key={key} id='chatContainer' dangerouslySetInnerHTML={{ __html: item.message}} className={`max-w-3/4 py-1 px-3 font-poppins text-lg rounded-3xl ${item.self ? 'bg-indigo-400' : 'bg-slate-600'} text-white ${item.self ? 'ml-auto' : 'mr-auto'} my-2`}>
                  
                </div>
              )
            })
          }
          
          <div ref={bottomRef} />
          
        </div>

        <div className="flex relative w-full justify-center items-center px-4 py-3 border-t-2 border-zinc-500/30">

          <div className={`absolute bottom-20 w-full px-5 ${text ? 'block':'hidden' }`}>
          <div className='bg-slate-900 max-h-36 overflow-auto px-3 py-2'>
            {
              dropdownItems.filter(item => item.label.includes(text)).map((itm, key) => {
                if(text==='') {
                  return null
                }
                else {
                  return (
                    <p onClick={() => setText(itm.value)} key={key} className='py-2 border-b-2 border-slate-700/60 cursor-pointer'>{itm.label}</p>
                  )
                }
              })
            }

          </div>

          </div>
          
          <input onKeyDown={(e) => {
              if (e.key === 'Enter') {
                socketEmit()
              }
            }} placeholder='Enter message' className='rounded-3xl w-full bg-slate-900 py-2 px-5 border-2 border-slate-700/50' onChange={(e) => setText(e.target.value)} type='text' value={text} />
            <button className='text-2xl bg-blue-400 py-2 px-2 flex justify-center items-center rounded-full font-bebas ml-2' onClick={socketEmit}>
              <img className='w-7' src={send_svg} />
            </button>
        </div>
      </div>
    </div>
  )
}

export default App
