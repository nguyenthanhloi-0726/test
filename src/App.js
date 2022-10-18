import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { categories } from "./constant";
import { Buffer } from "buffer";
import axios from "axios";

function App() {
  const editorRef = useRef(null);
  const [content, setContent] = useState("");

  const test = async () => {
    let formData = new FormData();

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(
      "GET",
      "https://vnforex.com/star-atlas-buoc-phat-trien-cua-gamefi-trong-2022/",
      false
    );
    xmlHttp.send(null);
    const str = xmlHttp.responseText
      .replace(/width=".+"/g, "")
      .replace(/height=".+"/g, "")
      .replace(/sizes=".+"/g, "")
      .replaceAll(
        '<img class="aligncenter',
        '<img style="display: block;margin: 24px auto;max-width:100%;" class="aligncenter'
      );

    const doc = new DOMParser().parseFromString(str, "text/html");
    const exclude = [
      "#ftwp-container-outer",
      ".a-wrap.a-wrap-base.a-wrap-8.alignwide",
      'div[style*="clear:both; margin-top:0em; margin-bottom:1em;"]',
    ];
    exclude.forEach((el) => {
      const elm = doc.querySelectorAll(el);
      elm.forEach((el) => {
        el.remove();
      });
    });

    const figureList = doc.querySelectorAll("figure");
    figureList.forEach((el) => {
      el.style = "text-align: center;font-style: italic;color:#8a8a8a;";
      el.firstChild &&
        (el.firstChild.style = "display:block;margin-bottom:12px;");
    });

    const mainFigure = doc.querySelector("#ftwp-postcontent>figure");
    mainFigure && (mainFigure.style.width = "100%");

    const content = doc.querySelector("#ftwp-postcontent").outerHTML;
    setContent(content);
    const em = doc.querySelector("#ftwp-postcontent em").innerHTML;
    const mainPost =
      em && em.indexOf("“") !== -1
        ? em.replaceAll("–", "-").slice(em.indexOf("“") + 1, em.indexOf("”"))
        : "";
    const categoryId = mainPost ? categories[mainPost] : "";
    console.log(mainPost);
    console.log(categoryId);

    const title = doc.querySelector("h1.is-title.post-title").innerHTML;

    const thumbnail = doc.querySelector("#ftwp-postcontent img");
    if (thumbnail) {
      thumbnail.setAttribute("width", "100%");
      const src = thumbnail?.src;

      console.log(thumbnail);
      console.log(src);

      if (src) {
        let response = await axios.get(src, {
          responseType: "arraybuffer",
        });
        const contentType = response.headers["content-type"].split("/")[1];

        let imageBuffer = Buffer.from(response.data, "binary");
        let file = new File([imageBuffer], `${title}.${contentType}`, {
          type: `data:image/${contentType};base64`,
        });

        console.log("=====>", file);
        console.log("=====>", response);
        console.log("=====>", imageBuffer);
        let formData = new FormData();
        formData.append("post[category_id]", "634d56d60452ac0001771961");
        formData.append("post[language_id]", "62f34df03b757f000188f1a7");
        formData.append("post[title]", "Bài viết cho category KAZAN con - 2");
        formData.append("post[slug]", "bai-viet-cho-category-kazan-con-2");
        formData.append("post[content]", "A");
        formData.append("post[summary]", "Bài viết cho category KAZAN con - 1");
        formData.append("post[thumbnail]", file);

        axios({
          method: "POST",
          url: "https://fsn-cms-api.fxce-fsn-dev.vncdevs.com/admin/posts",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmYjQ0NzUyYS05MzJmLTQ3NWEtYWIwOC1kODY3Y2Y1NWY0ZWYiLCJzY3AiOiJhZG1pbl91c2VyIiwiYXVkIjoid2ViIiwiaWF0IjoxNjY2MTExMjMyLCJleHAiOjE2NjYxMTQ4MzIsImp0aSI6ImVlYTI2YWY1LWI4ZjctNGRlYi05YTIyLTEyY2JiM2Q0MjFhNSIsImlzcyI6ImZ4Y2Vfc3NvIn0.gv815E7CqGS_Pf0cZPg1NhAx3okT3GEa9ar8tCzfEisF5gME9-fZXI0xkTStQFFwmjKQH7cPlAA-vEfvC-eJl6tiMCL8xuKzpJQBUO1t9CwbIFPd_0MNwwWrdsQQjOMbO25geNZ_9lZjBYAj6fc9RgTTABc3tjWeOR9VvY1hPevMCYypmygkgfpvAQ-ST897sYTDeF0gVSU2d9s22deXQ3BVpT0igTWWIG8FjMdPu6MTlzPIfWB7RXt1x9wrAoplKJwWh8cdY9EJffcPlOpZ5F1H1IM11WCcxszFcKCCTJ1hKaChWR1lMDLDGN2QjxE8w7bOQ4KtjuEaShTSJUkyAQ`,
          },
        });
      }
    }
  };

  // useEffect(() => {
  //   test();
  // }, []);

  return (
    <div className="App">
      <button onClick={test}>Test</button>
      <Editor
        value={content}
        tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={content}
        onEditorChange={(content) => setContent(content)}
        init={{
          height: 600,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],
          toolbar:
            "preview " +
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
}

export default App;
