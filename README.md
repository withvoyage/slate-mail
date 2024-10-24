# @withvoyage/slate-mail

A simple, notion-like email builder that can be embedded in React apps.

[Check out the demo](https://email.withvoyage.com/)

## Highlights

- **Rich text editing**: SlateMail uses TipTap, a rich text editor that supports markdown, images, and more.
- **Embeddable**: SlateMail can be embedded in any React app with simple ways to hook into controlled state.
- **Customizable**: SlateMail is built on [Slate](https://github.com/withvoyage/slate-ui), an open source, styleable component library.

## Installation

```bash
npm install @withvoyage/slate-mail
yarn add @withvoyage/slate-mail
```

## Usage

```jsx
import '@withvoyage/slate-mail/dist/styles/index.css';

import { useSlateEmail, SlateMail } from 'slatemail';
import { Editor } from '@tiptap/react';


// Use the SlateMail editor in your React app.
const { editor } = useSlateEmail({
  defaultValue: ..., // Initial value of the editor.
  liquidGroups: groups, // Groups of variables that can be inserted into the editor.
  onImageUpload: async (file: File) => {
    // Handle image upload and return url.
    return "";
  },
  onCreate: async (editor: Editor) => {
    // Callback when editor is initialized.
  },
  onUpdate: async (editor: Editor) => {
    // Callback when editor content is updated.
  },
});

return <SlateMail editor={editor} />;
```

Groups are defined like this:

```jsx
// Define groups of variables that can be used in the editor.
const groups = [
  {
    variables: [
      {
        id: "fname",
        name: "First Name",
        description: "First name of the contact.",
        icon: User, // LucideIcon
      },
      {
        id: "lname",
        name: "Last Name",
        description: "Last name of the contact.",
        icon: User, // LucideIcon
      },
    ],
    name: "contact",
    title: "Contact",
  },
];
```

## Run Demo Locally

```bash
git clone https://github.com/withvoyage/slate-mail.git
cd slate-mail
yarn
yarn dev
```

Navigate to `/src/demo/index.html` to see the demo locally.
