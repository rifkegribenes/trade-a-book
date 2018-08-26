const options = { year: "numeric", month: "short", day: "numeric" };

const formatDate = date => new Date(date).toLocaleDateString("en-US", options);

const tradeInfo = (
  userProposed,
  toUser,
  fromUser,
  status,
  createdAt,
  updatedAt
) => {
  const proposer = userProposed ? "You" : fromUser.firstName;
  const receiver = userProposed ? toUser.firstName : "you";
  const receiverInitial = receiver === "you" ? "You" : receiver;
  const tradeInfoCreated = `${proposer} proposed this trade on ${formatDate(
    createdAt
  )}.`;
  const tradeInfoPending = `Now waiting for ${receiver} to approve or reject.`;
  const tradeInfoProcessed = `${receiverInitial} ${status} it on ${formatDate(
    updatedAt
  )}.`;
  const message =
    status === "pending"
      ? `${tradeInfoCreated} ${tradeInfoPending}`
      : `${tradeInfoCreated} ${tradeInfoProcessed}`;
  return message;
};

export default tradeInfo;
