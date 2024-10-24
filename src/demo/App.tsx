import { useState } from "react";

import { Building, Code, User } from "lucide-react";
import { ActionIcon } from "slate-ui";
import { useLocalStorage } from "usehooks-ts";

import { JSONContent } from "@tiptap/react";

import { SlateEmailEditor } from "../";
import { useSlateEmail } from "../hooks/useSlateEmail";
import { seedContent } from "../utils";

export default function App() {
  const [html, setHtml] = useState("");
  const [showCode, setShowCode] = useState(false);

  const [content, setContent] = useLocalStorage<JSONContent>(
    "content",
    seedContent
  );

  const { editor } = useSlateEmail({
    defaultValue: content,
    liquidGroups: [
      {
        variables: [
          {
            id: "fname",
            name: "First Name",
            description: "First name of the contact.",
            icon: User,
          },
          {
            id: "lname",
            name: "Last Name",
            description: "Last name of the contact.",
            icon: User,
          },
          {
            id: "email",
            name: "Email",
            description: "Email address of the contact.",
            icon: User,
          },
          {
            id: "title",
            name: "Title",
            description: "Title of the contact.",
            icon: User,
          },
        ],
        name: "contact",
        title: "Contact",
      },
      {
        variables: [
          {
            id: "name",
            name: "Name",
            description: "Company name of the contact.",
            icon: Building,
          },
          {
            id: "website",
            name: "Website",
            description: "Website of the contact.",
            icon: Building,
          },
          {
            id: "industry",
            name: "Industry",
            description: "Industry of the contact.",
            icon: Building,
          },
          {
            id: "size",
            name: "Size",
            description: "Size of the contact.",
            icon: Building,
          },
        ],
        name: "company",
        title: "Company",
      },
    ],
    onImageUpload: async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const blobUrl = reader.result; // This will be a base64-encoded data URL
          if (typeof blobUrl !== "string") {
            reject("Error reading file: Invalid data URL.");
            return;
          }
          resolve(blobUrl);
        };

        reader.onerror = (error) => {
          reject("Error reading file: " + error);
        };

        reader.readAsDataURL(file); // Converts the file into a base64 URL
      });
    },
    onCreate: (editor) => {
      const html = editor.getHTML();
      setHtml(html);
      const json = editor.getJSON();
      setContent(json);
    },
    onUpdate: (editor) => {
      const html = editor.getHTML();
      setHtml(html);
      const json = editor.getJSON();
      setContent(json);
    },
  });

  return (
    <div className="flex items-stretch h-screen">
      <div className="editor bg-muted flex-1 min-h-0 overflow-y-auto">
        <SlateEmailEditor editor={editor} className="my-12" />
      </div>
      <div className="flex-1 max-w-[640px] max-h-screen overflow-y-auto overflow-x-hidden border-l relative">
        {showCode ? (
          <pre className="p-4 whitespace-pre-wrap">{html}</pre>
        ) : (
          <iframe
            title="Preview"
            srcDoc={`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                  body {
                    font-family: system-ui, sans-serif;
                    line-height: 1.625;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                  }

                  *::selection {
                    background-color: black;
                    color: white;
                  }

                  p {
                    margin: 12px 0px;
                  }
                </style>
              </head>
              <body>
                ${html}
              </body>
            </html>
            `}
            className="w-full h-full p-6"
          />
        )}

        <div className="absolute top-2 right-2">
          <ActionIcon
            icon={Code}
            onClick={() => setShowCode((prev) => !prev)}
            variant={!showCode ? "primary" : "secondary"}
          />
        </div>
      </div>
    </div>
  );
}
