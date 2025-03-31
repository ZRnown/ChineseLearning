import requests

def get_chat_response(message: str, system_prompt: str) -> str:
    """
    使用Google Gemini API获取聊天回复
    """
    try:
        # 构建完整的提示词
        full_prompt = f"{system_prompt}\n\n用户问题: {message}"
        
        # 调用Gemini API
        api_key = "AIzaSyDkCLl2WmZZtWKumwMOSq_79XK42qOiCUM"  # 使用跟前端相同的API密钥
        response = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}",
            json={
                "contents": [{
                    "parts": [{
                        "text": full_prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 2048,
                }
            },
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code != 200:
            print(f"Error from Gemini API: {response.text}")
            raise Exception(f"API请求失败: {response.status_code}")
        
        data = response.json()
        if data.get("candidates") and data["candidates"][0].get("content"):
            return data["candidates"][0]["content"]["parts"][0]["text"]
        else:
            raise Exception("API响应格式不正确")
        
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        raise Exception(f"AI服务调用失败: {str(e)}") 