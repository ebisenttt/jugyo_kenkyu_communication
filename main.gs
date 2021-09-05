const ss = SpreadsheetApp.getActiveSpreadsheet();

function doGet() {
  const html = HtmlService.createTemplateFromFile('index').evaluate();
  html
    .setTitle('R03授業見学コメント')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
  return html;
}

function getUserId() {
  const id = Session.getActiveUser().getUserLoginId();
  return id;
}

function getSubjectList() {
  const sheet = ss.getSheetByName('subject');
  const subjectList = sheet.getDataRange().getValues();
  subjectList.shift();
  console.log(subjectList);
  return subjectList;
}

function getTeacherList() {
  const sheet = ss.getSheetByName('teacher');
  const teacherList = sheet.getDataRange().getValues();
  teacherList.shift();
  const teacherObjList = teacherList.map(arr => {
    return {mail: arr[0], name: arr[1], subject: arr[2]};
  })
  return teacherObjList;
}

function getHomeroomList() {
  const sheet = ss.getSheetByName('homeroom');
  const classList = sheet.getDataRange().getValues();
  classList.shift();
  return classList;
}

function insertToSpreadSheet(obj) {
  console.log('insertToSpreadSheet');
  const sheet = ss.getSheetByName('comment');
  const timeStamp = new Date();
  const array = [
    timeStamp,
    obj.mail,
    obj.subject,
    obj.teacher,
    obj.homeroom,
    obj.good,
    obj.improved
  ];
  console.log(array);
  sheet.appendRow(array);
}

function sendMailGAS (obj) {
  const teacherList = getTeacherList();
  const teacherObj = teacherList.filter(teacher => teacher.name === obj.teacher)[0];
  const visitorMail = obj.mail;
  const visitorObj = teacherList.filter(teacher => teacher.mail === visitorMail)[0];

  const toTeacher = {
    mail: teacherObj.mail,
    subject: '[授業研究コメント]新しいコメントが届きました',
    body: `${obj.teacher} 先生\n\n`
      + '授業研究コメントフォームに新しいコメントが入力されました。\n\n'
      + `コメントした方: ${visitorObj.name}\n`
      + `教科: ${obj.subject}\n`
      + `授業者: ${obj.teacher}\n`
      + `クラス: ${obj.homeroom}\n`
      + '良かった点:\n' 
      + `${obj.good}\n`
      + '改善点:\n'
      + `${obj.improved}`
  };
  const toVisitor = {
    mail: visitorObj.mail,
    subject: '[授業研究コメント]コメントを送信しました',
    body: `${visitorObj.name} 先生\n\n`
      + `授業研究コメントフォームへの入力ありがとうございました。次の内容が授業者にメールで送信されました。\n\n`
      + '--------------\n'
      + toTeacher.body
      + '\n--------------'

  };
  const developer = '授業研究コメントフォーム担当者';
  
  MailApp.sendEmail(
    toTeacher.mail,
    toTeacher.subject,
    toTeacher.body,
    {
      name: developer
    }
  )

  MailApp.sendEmail(
    toVisitor.mail,
    toVisitor.subject,
    toVisitor.body,
    {
      name: developer
    }
  )
}

