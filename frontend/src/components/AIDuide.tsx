import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIDuideProps {
    text: string;
    language?: string;  // 从翻译组件传入的语言
}

// 语言映射表
const languageMap: { [key: string]: string } = {
    'ar': '阿拉伯语',
    'bn': '孟加拉语',
    'bg': '保加利亚语',
    'zh': '中文',
    'hr': '克罗地亚语',
    'cs': '捷克语',
    'da': '丹麦语',
    'nl': '荷兰语',
    'en': '英语',
    'et': '爱沙尼亚语',
    'fi': '芬兰语',
    'fr': '法语',
    'de': '德语',
    'el': '希腊语',
    'iw': '希伯来语',
    'hi': '印地语',
    'hu': '匈牙利语',
    'id': '印尼语',
    'it': '意大利语',
    'ja': '日语',
    'ko': '韩语',
    'lv': '拉脱维亚语',
    'lt': '立陶宛语',
    'no': '挪威语',
    'pl': '波兰语',
    'pt': '葡萄牙语',
    'ro': '罗马尼亚语',
    'ru': '俄语',
    'sr': '塞尔维亚语',
    'sk': '斯洛伐克语',
    'sl': '斯洛维尼亚语',
    'es': '西班牙语',
    'sw': '斯瓦希里语',
    'sv': '瑞典语',
    'th': '泰语',
    'tr': '土耳其语',
    'uk': '乌克兰语',
    'vi': '越南语'
};

// 语言提示词映射
const languagePrompts: { [key: string]: string } = {
    'ar': 'الرجاء الرد باللغة العربية فقط',
    'bn': 'অনুগ্রহ করে শুধুমাত্র বাংলায় উত্তর দিন',
    'bg': 'Моля, отговорете само на български',
    'zh': '请使用中文回答',
    'hr': 'Molimo odgovorite samo na hrvatskom',
    'cs': 'Prosím, odpovězte pouze v češtině',
    'da': 'Svar venligst kun på dansk',
    'nl': 'Antwoord alstublieft alleen in het Nederlands',
    'en': 'Please respond in English only',
    'et': 'Palun vastake ainult eesti keeles',
    'fi': 'Vastaa vain suomeksi',
    'fr': 'Veuillez répondre en français uniquement',
    'de': 'Bitte antworten Sie nur auf Deutsch',
    'el': 'Παρακαλώ απαντήστε μόνο στα ελληνικά',
    'iw': 'אנא ענה רק בעברית',
    'hi': 'कृपया केवल हिंदी में उत्तर दें',
    'hu': 'Kérjük, válaszoljon csak magyarul',
    'id': 'Silakan jawab hanya dalam bahasa Indonesia',
    'it': 'Si prega di rispondere solo in italiano',
    'ja': '日本語で回答してください',
    'ko': '한국어로 답변해 주세요',
    'lv': 'Lūdzu atbildiet tikai latviešu valodā',
    'lt': 'Prašome atsakyti tik lietuvių kalba',
    'no': 'Vennligst svar kun på norsk',
    'pl': 'Proszę odpowiadać tylko w języku polskim',
    'pt': 'Por favor, responda apenas em português',
    'ro': 'Vă rugăm să răspundeți doar în română',
    'ru': 'Пожалуйста, отвечайте только на русском языке',
    'sr': 'Молимо одговорите само на српском',
    'sk': 'Prosím, odpovedzte len po slovensky',
    'sl': 'Prosim, odgovorite samo v slovenščini',
    'es': 'Por favor, responda solo en español',
    'sw': 'Tafadhali jibu kwa Kiswahili tu',
    'sv': 'Vänligen svara endast på svenska',
    'th': 'กรุณาตอบเป็นภาษาไทยเท่านั้น',
    'tr': 'Lütfen sadece Türkçe yanıt verin',
    'uk': 'Будь ласка, відповідайте тільки українською мовою',
    'vi': 'Vui lòng chỉ trả lời bằng tiếng Việt'
};

// 系统提示词映射
const systemPrompts: { [key: string]: string } = {
    'ar': 'أنت خبير في اللغة الصينية الكلاسيكية.',
    'bn': 'আপনি একজন ক্লাসিক্যাল চাইনিজ ভাষার বিশেষজ্ঞ।',
    'bg': 'Вие сте експерт по класически китайски език.',
    'zh': '你是一位专业的古文解读专家。',
    'hr': 'Vi ste stručnjak za klasični kineski jezik.',
    'cs': 'Jste odborník na klasickou čínštinu.',
    'da': 'Du er en ekspert i klassisk kinesisk.',
    'nl': 'U bent een expert in klassiek Chinees.',
    'en': 'You are a professional classical Chinese expert.',
    'et': 'Olete klassikalise hiina keele ekspert.',
    'fi': 'Olet ammattitaitoinen klassisen kiinan kielen asiantuntija.',
    'fr': 'Vous êtes un expert en chinois classique.',
    'de': 'Sie sind ein Experte für klassisches Chinesisch.',
    'el': 'Είστε ειδικός στην κλασική κινεζική γλώσσα.',
    'iw': 'אתה מומחה בסינית קלאסית.',
    'hi': 'आप क्लासिक चीनी भाषा के विशेषज्ञ हैं।',
    'hu': 'Ön egy klasszikus kínai nyelv szakértője.',
    'id': 'Anda adalah ahli bahasa Cina klasik.',
    'it': 'Sei un esperto di cinese classico.',
    'ja': 'あなたは古典中国語の専門家です。',
    'ko': '당신은 전문적인 중국 고전 해석 전문가입니다.',
    'lv': 'Jūs esat klasiskās ķīniešu valodas eksperts.',
    'lt': 'Jūs esate klasikinės kinų kalbos ekspertas.',
    'no': 'Du er en ekspert på klassisk kinesisk.',
    'pl': 'Jesteś ekspertem w klasycznym języku chińskim.',
    'pt': 'Você é um especialista em chinês clássico.',
    'ro': 'Sunteți un expert în limba chineză clasică.',
    'ru': 'Вы являетесь экспертом по классическому китайскому языку.',
    'sr': 'Ви сте стручњак за класични кинески језик.',
    'sk': 'Ste odborník na klasickú čínštinu.',
    'sl': 'Strokovnjak ste za klasično kitajščino.',
    'es': 'Eres un experto en chino clásico.',
    'sw': 'Wewe ni mtaalam wa Kisini cha kale.',
    'sv': 'Du är en expert på klassisk kinesiska.',
    'th': 'คุณเป็นผู้เชี่ยวชาญด้านภาษาจีนโบราณ',
    'tr': 'Klasik Çince konusunda uzmansınız.',
    'uk': 'Ви є експертом з класичної китайської мови.',
    'vi': 'Bạn là chuyên gia về tiếng Trung cổ đại.'
};

// 格式模板映射
const formatTemplates: { [key: string]: string } = {
    'zh': `# 字词解释
（解释重要字词的含义）

# 整体翻译
（用现代汉语翻译全文）

# 深入解读
（分析这段话的思想内涵和现实意义）

# 相关典故
（详细说明与这段文字相关的历史背景、典故和影响）`,

    'en': `# Word Analysis
(Explain the meaning of key words and phrases)

# Complete Translation
(Provide a complete translation of the text)

# In-depth Interpretation
(Analyze the philosophical meaning and practical significance)

# Historical Context
(Explain the historical background, allusions, and influence)`,

    'ja': `# 単語と語句の解説
（重要な単語や語句の意味を説明）

# 全文翻訳
（全文を現代日本語に翻訳）

# 詳細な解釈
（この文章の思想的な意味と現実的な意義を分析）

# 関連する故事
（この文章に関連する歴史的背景、故事、影響について詳しく説明）`,

    'ko': `# 단어 분석
(중요한 단어와 구문의 의미 설명)

# 전체 번역
(전문을 현대 한국어로 번역)

# 심층 해석
(이 문장의 사상적 의미와 현실적 의의 분석)

# 관련 고사
(이 문장과 관련된 역사적 배경, 고사, 영향에 대한 상세 설명)`,

    'fr': `# Analyse des mots
(Expliquer le sens des mots et expressions clés)

# Traduction complète
(Fournir une traduction complète du texte)

# Interprétation approfondie
(Analyser la signification philosophique et l'importance pratique)

# Contexte historique
(Expliquer le contexte historique, les allusions et l'influence)`,

    'de': `# Wortanalyse
(Erklärung der Bedeutung wichtiger Wörter und Phrasen)

# Vollständige Übersetzung
(Vollständige Übersetzung des Textes)

# Tiefgehende Interpretation
(Analyse der philosophischen Bedeutung und praktischen Relevanz)

# Historischer Kontext
(Erklärung des historischen Hintergrunds, Anspielungen und Einflüsse)`,

    'es': `# Análisis de palabras
(Explicar el significado de palabras y frases clave)

# Traducción completa
(Proporcionar una traducción completa del texto)

# Interpretación profunda
(Analizar el significado filosófico y la importancia práctica)

# Contexto histórico
(Explicar el contexto histórico, alusiones e influencias)`,

    'it': `# Analisi delle parole
(Spiegare il significato di parole e frasi chiave)

# Traduzione completa
(Fornire una traduzione completa del testo)

# Interpretazione approfondita
(Analizzare il significato filosofico e l'importanza pratica)

# Contesto storico
(Spiegare il contesto storico, le allusioni e le influenze)`,

    'ru': `# Анализ слов
(Объяснение значения ключевых слов и фраз)

# Полный перевод
(Предоставление полного перевода текста)

# Глубокий анализ
(Анализ философского значения и практической значимости)

# Исторический контекст
(Объяснение исторического фона, аллюзий и влияния)`,

    'ar': `# تحليل الكلمات
(شرح معنى الكلمات والعبارات الرئيسية)

# الترجمة الكاملة
(تقديم ترجمة كاملة للنص)

# التفسير العميق
(تحليل المعنى الفلسفي والأهمية العملية)

# السياق التاريخي
(شرح الخلفية التاريخية والإشارات والتأثيرات)`,

    'pl': `# Analiza słów
(Wyjaśnienie znaczenia kluczowych słów i zwrotów)

# Pełne tłumaczenie
(Przekład całego tekstu)

# Szczegółowa interpretacja
(Analiza znaczenia filozoficznego i praktycznego)

# Kontekst historyczny
(Wyjaśnienie tła historycznego, aluzji i wpływów)`
};

const getFormatTemplate = (code: string | undefined): string => {
    if (!code) return formatTemplates['zh'];
    return formatTemplates[code.toLowerCase()] || formatTemplates['en'];
};

const getLanguageName = (code: string | undefined): string => {
    if (!code) return '中文';
    return languageMap[code.toLowerCase()] || code;
};

const AIDuide: React.FC<AIDuideProps> = ({ text, language }) => {
    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 添加语言参数日志
    console.log('AIDuide组件接收到的语言参数:', language);
    console.log('当前语言映射:', languageMap[language || '']);

    const getLanguagePrompt = (code: string | undefined): string => {
        if (!code) return languagePrompts['zh'];
        const prompt = languagePrompts[code.toLowerCase()] || `Please respond only in ${getLanguageName(code)}`;
        console.log('获取到的语言提示:', prompt);
        return prompt;
    };

    const fetchAIData = async (): Promise<string> => {
        setIsLoading(true);
        setExplanation('');

        try {
            const apiKey = 'AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM';
            if (!apiKey) {
                throw new Error("Gemini API密钥未配置");
            }

            const systemContent = `${systemPrompts[language?.toLowerCase() || 'zh']} ${getLanguagePrompt(language)} ${getLanguageName(language)}で回答してください。英語は使用しないでください。`;
            const userContent = `${getLanguagePrompt(language)}

${getFormatTemplate(language)}

"${text}"

重要提示：
1. 回答必须完全使用${getLanguageName(language)}
2. 禁止使用任何英文内容
3. 每个部分都需要详细解释
4. 保持专业性和学术性
5. 确保回答的完整性和准确性`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemContent}\n\n${userContent}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 2048,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API错误详情:', errorData);
                throw new Error(`API请求失败: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Gemini API响应:', data);

            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const generatedText = data.candidates[0].content.parts[0].text;
                console.log('最终生成的回答:', generatedText);
                return generatedText;
            } else {
                throw new Error('API响应格式不正确');
            }
        } catch (error) {
            console.error('API调用错误:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateAIGuide = async () => {
        try {
            setIsLoading(true);
            const response = await fetchAIData();
            setExplanation(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            setExplanation(`# 错误\n\nAI 导读生成失败：${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#f8f5f0] rounded-lg shadow-lg p-6 border border-[#e8e4e0]">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-[#2c3e50] font-serif">AI 导读</h3>
                    <span className="ml-2 text-sm text-[#666]">智能解读古典文学</span>
                </div>
                <button
                    onClick={handleGenerateAIGuide}
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-md transition-all duration-300 ${isLoading
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : 'bg-[#8b4513] hover:bg-[#6b3410] text-white shadow-md hover:shadow-lg'
                        }`}
                >
                    {isLoading ? '生成中...' : '生成导读'}
                </button>
            </div>

            {!explanation && !isLoading && (
                <div className="text-center py-12">
                    <div className="text-[#666] text-lg mb-2">点击"生成导读"按钮开始分析文章</div>
                    <div className="text-[#999] text-sm">智能解读，深入浅出</div>
                </div>
            )}

            {isLoading && (
                <div className="text-center py-12">
                    <div className="text-[#666] text-lg mb-2">正在生成AI导读，请稍候...</div>
                    <div className="text-[#999] text-sm">静待佳音</div>
                </div>
            )}

            {explanation && (
                <div className="prose max-w-none dark:prose-invert prose-headings:font-serif prose-headings:text-[#2c3e50] prose-p:text-[#444] prose-strong:text-[#8b4513] prose-a:text-[#8b4513] prose-a:no-underline hover:prose-a:underline">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default AIDuide; 