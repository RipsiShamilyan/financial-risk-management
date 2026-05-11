import React, { useState } from "react";
import { useForm } from "react-hook-form";
import '../css/ChatBot.css';

const questionAnswerDB = {
    "Ինչ է ֆինանսական ռիսկը?": "Ֆինանսական ռիսկը վերաբերում է այն հնարավորություններին, որոնք կարող են բացասաբար ազդել ընկերության կամ անհատի ֆինանսական դրության վրա։",
    "Ինչպես կարելի է նվազեցնել ռիսկերը?": "Կարող ենք նվազեցնել ռիսկերը՝ ճիշտ վերլուծելով հնարավորությունները, կիրառելով ծախսերի վերահսկողություն և դիվերսիֆիկացնելով ներդրումները։",
    "Ինչ է բյուջետավորումը?": "Բյուջետավորումը ֆինանսական պլանավորման գործընթաց է, որը օգնում է մարդկանց և կազմակերպություններին վերահսկել իրենց եկամուտներն ու ծախսերը։",
    "Ինչ է ռիսկերի գնահատումը?": "Ռիսկերի գնահատումը պահանջում է ռիսկերի ճանաչում, գնահատում և դրանց նվազեցման հնարավորությունների գնահատում։",
    "Բարև ես Թամարան եմ":"Ուրախ եմ Թամարա ջան ինչով կարող եմ օգնել",
    "Ինչ հնարավորություններ ունի RiskSnap հավելվածը?":"RiskSnap հավելվածի միջոցով կարող եք կառավարել ձեր ֆինանասները, հաշվարկել ձեր ծախսերը, վարկերը, ինչպես նաև կարող եք հաշվել ձեր համախառն աշխատավարձը որպեսզի տեսնեք ձեր մաքուր աշխատավարձը",
    "Ինչ է անում բյուջեի էջը?":"Այս էջը հնարավորություն է տալիս օգտվողներին հաշվարկել իրենց բյուջեն՝ հիմնվելով եկամուտների և ծախսերի վրա, ինչպես նաև պահել և դիտել նախորդ բյուջեները։ Օգտվողները կարող են խմբագրել և ջնջել իրենց պահպանած բյուջեները։",
    "Ինչի համար է ռիսկի կառավարում էջը ?":"Այս էջը օգտագործվում է ֆինանսական ռիսկի գնահատման համար, որտեղ օգտատերը պատասխաններ է տալիս տարբեր հարցերի, ինչպիսիք են եկամուտը, խնայողությունները, պարտքերը և ֆինանսական բարձիկը։ Հարցերին պատասխանելու արդյունքում հաշվարկվում է ռիսկի մակարդակը (ցածր, միջին կամ բարձր), և տրամադրվում են խորհուրդներ հիմնված այդ գնահատականի վրա։",
    "Ինչի համար է վարկի ռիսկի վերլուծություն ?":"Այս էջը հաշվարկում է վարկի ռիսկը՝ հաշվի առնելով օգտատիրոջ ամսական եկամուտը, ծախսերը և գործող կամ նոր վարկի պայմանները: Այն տրամադրում է որոշում և խորհուրդներ վարկի ռիսկի մասին՝ հիմնվելով DSR (Պարտքի ծառայողական եկամտի հարաբերակցություն) ցուցանիշի վրա։",
    "Ինչի համար է աշխատավարձի հաշվիչ ?":"Այս էջը նախատեսված է հաշվարկելու աշխատավարձի զուտ գումարը՝ հաշվի առնելով եկամտային հարկերը, սոցիալական վճարները և դրոշմանիշային վճարը: Օգտագործողը կարող է մուտքագրել համախառն աշխատավարձը, ընտրել արժույթը և ստանալ հաշվարկված արդյունքները, ինչպես նաև դիտել նախորդ հաշվարկների պատմությունը։",
    "Ինչի համար է վարկային հաշվի ?":"Այս էջը նախատեսված է հաշվարկելու վարկի ամսական մարումներն ու ընդհանուր մարումները՝ հաշվի առնելով վարկի գումարը, ժամկետը և տոկոսադրույքը: Օգտագործողը մուտքագրում է տվյալները, և հաշվում են ամուսնական մարումներն ու ընդհանուր վճարումները, որոնք ցուցադրվում են էջում:",
};

const ChatBot = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [messages, setMessages] = useState([
        { text: "Բարև, ես Օնիկն եմ 🤩։ Այստեղ եմ քեզ օգնելու համար?", from: "bot" },
    ]);
    const [isEmailMode, setIsEmailMode] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false); 

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const handleSendMessage = (data) => {
        const userMessage = data.message.trim();
    
        if (userMessage !== '') {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: userMessage, from: "user" }
            ]);
            setValue("message", '');
    
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "", from: "bot", isTyping: true }
            ]);
    
            setTimeout(() => {
                setMessages(prevMessages => prevMessages.filter(msg => !msg.isTyping));
    
                // Նորությամբ եթե հարցը չկա բազայում
                const botResponse = questionAnswerDB[userMessage] || "Ցավոք ես այս հարցի պատասխանը չունեմ։ Խնդրում ենք մուտքագրեք ձեր էլ-հասցեն։";
    
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: botResponse, from: "bot" }
                ]);
    
                // Եթե մենք չունենք պատասխան, ապա անցնում ենք էլ-հասցի մուտքագրմանը
                if (!questionAnswerDB[userMessage]) {
                    setIsEmailMode(true);
                }
            }, 2000);
        }
    };
    
    const handleEmailSubmit = (data) => {
        const email = data.email.trim();
        if (email === '') {
            alert("Խնդրում ենք մուտքագրել ձեր էլ-հասցեն։");
        } else if (!emailRegex.test(email)) {
            alert("Խնդրում ենք մուտքագրել ճիշտ էլ-հասցե։ Օրինակ՝ user@example.com");
        } else {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: `Շնորհակալություն։ Մենք կպատասխանենք ձեր հարցին ձեր էլ-հասցեին՝ ${email}.`, from: "bot" }
            ]);
            setValue("email", '');
            setIsEmailMode(false);
        }
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div className="chatbot-container">
            {isChatOpen && (
                <div className="chatbot-box">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.from}`}>
                                {msg.isTyping ? (
                                    <div className="typing-indicator">
                                        <span>.</span>
                                        <span>.</span>
                                        <span>.</span>
                                    </div>
                                ) : (
                                    <p>{msg.text}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="input-box">
                        {isEmailMode ? (
                            <form onSubmit={handleSubmit(handleEmailSubmit)}>
                                <input
                                    type="email"
                                    {...register("email", { required: "Խնդրում ենք մուտքագրել ձեր էլ-հասցեն" })}
                                    placeholder="Ներառեք ձեր էլ-հասցեն"
                                />
                                <button type="submit" className="submit-button">➤</button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit(handleSendMessage)}>
                                <input
                                    type="text"
                                    {...register("message", { required: "Խնդրում ենք մուտքագրել հարց" })}
                                    placeholder="Հարցեր..."
                                    className="user-input"
                                />
                                <button type="submit" className="submit-button">➤</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
            <button className="chatbot-toggle" onClick={toggleChat}>
                {isChatOpen ? "✖️" : "Բացել Չատբոտը"}
            </button>
        </div>
    );
};

export default ChatBot;
