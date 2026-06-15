import json
import os
import urllib.request

BOT_TOKEN = os.environ.get("BOT_TOKEN", "")
CHAT_ID   = os.environ.get("CHAT_ID", "")

def send_message(text):
    url  = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = json.dumps({
        "chat_id":    CHAT_ID,
        "text":       text,
        "parse_mode": "HTML"
    }).encode("utf-8")
    req = urllib.request.Request(
        url, data=data,
        headers={"Content-Type": "application/json"}
    )
    urllib.request.urlopen(req)

def handler(request):
    # CORS preflight
    if request.method == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin":  "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": ""
        }

    if request.method == "POST":
        try:
            body = request.body
            if isinstance(body, bytes):
                body = body.decode("utf-8")
            data = json.loads(body)

            name    = data.get("name",    "—")
            phone   = data.get("phone",   "—")
            goal    = data.get("goal",    "—")
            comment = data.get("comment", "—")

            msg = (
                f"🔥 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>\n\n"
                f"👤 <b>Имя:</b> {name}\n"
                f"📱 <b>Контакт:</b> {phone}\n"
                f"🎯 <b>Цель:</b> {goal}\n"
                f"💬 <b>Комментарий:</b> {comment}\n\n"
                f"⏱ Ответь клиенту как можно скорее!"
            )
            send_message(msg)

            return {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json"
                },
                "body": json.dumps({"ok": True})
            }

        except Exception as e:
            return {
                "statusCode": 500,
                "headers": {"Access-Control-Allow-Origin": "*"},
                "body": json.dumps({"error": str(e)})
            }

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True})
    }
