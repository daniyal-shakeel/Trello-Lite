const collaboratorInviteTemplate = ({ name, boardName, boardId }) => {
  const boardLink = `${process.env.FRONTEND_URL}/board/${boardId}`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f7;
      color: #333;
      margin: 0;
      padding: 20px;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h1 { color: #2d3748; }
    p { font-size: 16px; line-height: 1.6; }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 25px;
      font-size: 16px;
      background-color: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
    }
    ul { line-height: 1.6; }
  </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello ${name}!</h1>
      <p>You have been invited to collaborate on the project board: <strong>${boardName}</strong>.</p>
      <p>This board will help you organize tasks, track progress, and collaborate with your team effectively. As a collaborator, you can:</p>
      <ul>
        <li>View all tasks and their status</li>
        <li>Add new tasks and assign them to team members</li>
        <li>Comment on tasks to share updates or feedback</li>
        <li>Monitor overall project progress</li>
      </ul>
      <p>Click the button below to access the board:</p>
      <a href="${boardLink}" class="button">Access Board</a>
      <p>Please note:</p>
      <ul>
        <li>If you are new, you may need to register first.</li>
        <li>Keep your login credentials secure.</li>
        <li>If you did not expect this email, ignore it safely.</li>
      </ul>
      <p class="footer">This is an automated email. Do not reply. Contact your board admin for support.</p>
    </div>
  </body>
  </html>
  `;
};

export {collaboratorInviteTemplate}