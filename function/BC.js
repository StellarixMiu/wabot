if(msg.body === "BC ") {
  const getAllChats = await client.getChats()
  const chatIDs = []
  const message = msg.body.split(" ")[0]
  
  for (let i = 0; i < getAllChats.length; i++) {
    chatIDs.push(getAllChats[i].id._serialized)
  }

  for (let i = 0; i < chatIDs.length; i++) {
    await client.sendMessage(chatIDs[i], message)
  }
}