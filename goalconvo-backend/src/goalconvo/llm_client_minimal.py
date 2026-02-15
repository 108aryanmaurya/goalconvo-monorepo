
import json
import urllib.request
import urllib.parse
import urllib.error
import time

class LLMClient:
    def __init__(self, config):
        self.config = config
        self.api_config = config.get_api_config()
    
    def generate_completion(self, prompt, temperature=0.7, top_p=0.9, max_tokens=512):
        """Generate completion using basic HTTP requests."""
        url = f"{self.api_config['api_base']}/chat/completions"
        
        headers = {
            "Authorization": f"Bearer {self.api_config['api_key']}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.api_config["model"],
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens
        }
        
        try:
            req = urllib.request.Request(url, json.dumps(data).encode(), headers)
            with urllib.request.urlopen(req, timeout=self.config.timeout) as response:
                result = json.loads(response.read().decode())
                return result["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"API Error: {e}")
            return "Error: API call failed"
    
    def test_connection(self):
        """Test API connection."""
        try:
            response = self.generate_completion("Hello, this is a test.", max_tokens=10)
            return "test" in response.lower()
        except:
            return False
