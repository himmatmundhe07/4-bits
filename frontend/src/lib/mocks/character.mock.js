export const getMyCharacterMock = async (roomCode, playerId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    identity: {
      name: "Dr. Arthur Pendelton",
      role: "The Suspicious Physician",
      age: 54,
      occupation: "Private Medical Practitioner"
    },
    background: "You have been the personal physician to the victim for over two decades. Recently, your medical practice has fallen on hard times due to a series of malpractice lawsuits. The victim was one of your few remaining wealthy clients, but they had recently threatened to cut you off after a disagreement about their medication.",
    secret: "You have been siphoning small amounts of money from the victim's accounts to keep your practice afloat. If the police look too closely at your financials, you will be ruined.",
    objective: "Divert suspicion away from your financial records. If anyone asks about your money, insist your practice is thriving.",
    relationships: [
      { name: "Eleanor Vance", relation: "The victim's niece. She always thought you were a quack." },
      { name: "Thomas Sterling", relation: "The butler. He caught you snooping in the victim's study last week." }
    ]
  };
};
