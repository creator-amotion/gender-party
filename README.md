# Gender Party — Артём + Лиза

Сайт опубликован здесь: https://creator-amotion.github.io/gender-party/

## Ответы (голоса и «Приду»)

Данные принимает Google Apps Script Web App, привязанный к таблице
`Gender Party — Ответы`. URL приёмника прописан в `script.js`
(`FORM_CONFIG.actionUrl`).

Если понадобится пересоздать приёмник (например, если ссылка перестала
работать):

1. В таблице-приёмнике: **Расширения → Apps Script**
2. Код должен быть:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = e.parameter;
     sheet.appendRow([new Date(), data.name || "", data.vote || "", data.attend || ""]);
     return ContentService.createTextOutput(JSON.stringify({status: "ok"}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. **Deploy → New deployment** → тип **Web app** → Execute as: **Me**,
   Who has access: **Anyone** → Deploy → авторизовать свой аккаунт.
4. Скопировать ссылку (заканчивается на `/exec`) и вставить в
   `script.js` → `FORM_CONFIG.actionUrl`.

Раньше использовалась Google Форма напрямую, но Google стал блокировать
такие анонимные отправки (требует токен сессии, который сайт не может
получить из-за CORS) — поэтому теперь используется Apps Script.

## Фото и фон

Файлы лежат в `assets/`:

- `hero-bg.jpeg` — фон обложки
- `countdown-bg.png`, `details-bg.png`, `vote-bg.png`, `rsvp-bg.png` —
  фон каждого раздела (подобраны по смыслу иконок на них)
- `boy.png`, `girl.png` — фото для голосования
- `redball.png`, `blueball.png` — летящие шарики на обложке
- `couple.jpeg` — фото пары в подвале сайта

## Публикация изменений

```bash
git add -A
git commit -m "..."
git push
```

GitHub Pages сам обновит сайт через 1-2 минуты после пуша в `main`.
