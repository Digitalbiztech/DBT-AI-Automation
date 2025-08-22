# Connecting Articles Page to Supabase

This guide explains how to connect your Articles page to a Supabase database so you can fetch and display articles dynamically.

---

## 1. Set Up Supabase
- Go to [https://supabase.com/](https://supabase.com/) and create a free project.
- In the Supabase dashboard, create a new table (e.g., `articles`) with columns:
  - `id` (integer, primary key, auto-increment)
  - `title` (text)
  - `summary` (text)
  - `publishDate` (date or text)
  - `link` (text)
  - (optional) `category`, `tags` (text/array), etc.

## 2. Get Your Supabase Project URL and Anon Key
- In your Supabase project, go to **Project Settings > API**.
- Copy the **Project URL** and **anon public key**.

## 3. Install Supabase JS Client
```sh
npm install @supabase/supabase-js
```

## 4. Initialize Supabase Client
Create a file like `src/lib/supabaseClient.ts`:
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## 5. Fetch Articles from Supabase
In your `Articles.tsx`:
- Import the client:
  ```js
  import { supabase } from '@/lib/supabaseClient';
  ```
- Add a state for articles:
  ```js
  const [articles, setArticles] = useState<Article[]>([]);
  ```
- Update your `fetchFromDB` function:
  ```js
  const fetchFromDB = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('publishDate', { ascending: false });
    if (error) {
      alert('Error fetching articles: ' + error.message);
    } else {
      setArticles(data);
    }
  };
  ```
- Make sure your rendering uses the `articles` state.

## 6. Render the Fetched Articles
Replace your static articles array with the state:
```js
{articles.map((article) => (
  // ...render each article card as before
))}
```

## 7. (Optional) Insert Articles
If you want to add new articles to Supabase from your UI:
```js
const addArticle = async (article: Article) => {
  const { data, error } = await supabase
    .from('articles')
    .insert([article]);
  // handle response
};
```

---

## Summary
- **Create a Supabase table** for your articles.
- **Install and configure** the Supabase JS client in your project.
- **Fetch articles** from Supabase in your `fetchFromDB` function and update your state.
- **Render the articles** from state, not a static array.

---

**You can copy-paste this logic into your project when ready!** 

---

## Adding "Connect to DB" for Weekly Content & Trends Pages

You can use the same logic as the Articles page to connect your Weekly Content and Trends pages to Supabase (or any DB):

### 1. Add a "Connect" Button at the Top
- Place a single "Connect" button at the top of each page (not on every card).
- When clicked, it should fetch data from your database and populate the page with rows from the DB.

### 2. Create a Fetch Function
- Write a function (e.g., `fetchWeeklyContentFromDB` or `fetchTrendsFromDB`) that:
  - Connects to your DB (Supabase or other).
  - Fetches the relevant data (title, text, date, source, etc.).
  - Updates the page’s state to display the fetched items.

### 3. Example Code Structure
```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
// import { createClient } from "@supabase/supabase-js"; // If using Supabase

const WeeklyContent = () => {
  const [content, setContent] = useState([]);

  // Placeholder fetch function
  const fetchFromDB = async () => {
    // Replace this with your actual DB fetch logic
    // Example for Supabase:
    // const { data, error } = await supabase.from('weekly_content').select('*');
    // setContent(data);

    alert("Fetching weekly content from DB (simulate Supabase)");
    // setContent(simulatedData);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Weekly Content</h2>
        <Button onClick={fetchFromDB} variant="default">
          Connect to DB
        </Button>
      </div>
      {/* Render your content here */}
      {content.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};

export default WeeklyContent;
```
- Repeat this pattern for your Trends page.
- Replace the placeholder fetch logic with your actual DB call (see above for Supabase details).

### Summary of Steps
1. Add a single "Connect" button at the top of each page.
2. On click, fetch data from your DB and update the page’s state.
3. Render the fetched data as your content cards/rows. 