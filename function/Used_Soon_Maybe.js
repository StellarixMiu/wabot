const TEST_JID = "number@c.us"; // modify
const TEST_GROUP = "GROUP_ID"; // modify
const buttons_reply = new Buttons(
  "test",
  [{ body: "Test", id: "test-1" }],
  "title",
  "footer"
); // Reply button

const buttons_reply_url = new Buttons(
  "test",
  [
    { body: "Test", id: "test-1" },
    { body: "Test 2", url: "https://wwebjs.dev" },
  ],
  "title",
  "footer"
); // Reply button with URL

const buttons_reply_call = new Buttons(
  "test",
  [
    { body: "Test", id: "test-1" },
    { body: "Test 2 Call", url: "+1 (234) 567-8901" },
  ],
  "title",
  "footer"
); // Reply button with call button

const buttons_reply_call_url = new Buttons(
  "test",
  [
    { body: "Test", id: "test-1" },
    { body: "Test 2 Call", url: "+1 (234) 567-8901" },
    { body: "Test 3 URL", url: "https://wwebjs.dev" },
  ],
  "title",
  "footer"
); // Reply button with call button & url button

const section = {
  title: "test",
  rows: [
    {
      title: "Test 1",
    },
    {
      title: "Test 2",
      id: "test-2",
    },
    {
      title: "Test 3",
      description: "This is a smaller text field, a description",
    },
    {
      title: "Test 4",
      description: "This is a smaller text field, a description",
      id: "test-4",
    },
  ],
};

// send to test_jid
for (const component of [
  buttons_reply,
  buttons_reply_url,
  buttons_reply_call,
  buttons_reply_call_url,
])
  await client.sendMessage(TEST_JID, component);

// send to test_group
for (const component of [
  buttons_reply,
  buttons_reply_url,
  buttons_reply_call,
  buttons_reply_call_url,
])
  await client.sendMessage(TEST_GROUP, component);

const list = new List("test", "click me", [section], "title", "footer");
await client.sendMessage(TEST_JID, list);
await client.sendMessage(TEST_GROUP, list);

// else if (msg.body.startsWith("!p ")) {
//   const chat = await msg.getChat();
//   const username = msg.body.split(" ")[1];
//   chat.sendStateRecording();
//   try {
//     await tiktokProfile(username).then(async (profile) => {
//       // console.log(profile)

//       let listVideo = []

//       for(const profileData of profile.videos) {
//         let profileDataTitle = `${profileData.videoTitle}`
//         if (profileDataTitle === "") {
//           profileDataTitle = "No Title Found"
//         }
//         const profileDataViews = `${profileData.videoViews}`
//         listVideo.push({
//           title: profileDataTitle,
//           description: profileDataViews,
//         })
//       }
//       // console.log(listVideo.length)

//       const section = {
//         title: "List Videos",
//         rows: listVideo,
//       };
//       let dataProfile = profile.profile
//       if (dataProfile.Bio === "") {
//         dataProfile.Bio = "No Bio"
//       }
//       const listDescription = 
//       `Username: ${dataProfile.Title}
// Name: ${dataProfile.Subtitle}
// Following: ${dataProfile.Following}
// Followers: ${dataProfile.Followers}
// Likes: ${dataProfile.Likes}
// Bio: ${dataProfile.Bio}
// Total Videos: ${listVideo.length}`

//       const list = new List(`${listDescription}`, "List Videos", [section], "User Profile", "Created by Bot");

//       chat.sendMessage(list);
//       msg.react("👍");
//     });
//   } catch (err) {
//     console.log(err);
//   }
// } 


  // for (const SimplifiedProduct of SimplifiedProducts) {
  //   const ProductName = `${SimplifiedProduct.productName} (${SimplifiedProduct.VariantName})`;
  //   const ProductDescription = `${SimplifiedProduct.productDescription}`;
  //   const ProductId = `miu${SimplifiedProduct.productName}-${SimplifiedProduct.VariantName}`;
  //   listProduct.push({
  //     title: ProductName,
  //     description: ProductDescription,
  //     id: ProductId,
  //   });
  //   ProductIds.push(ProductId);
  // }
