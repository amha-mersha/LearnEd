export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export const dummy = {
  "message": [
      {
          "question": "What is the primary characteristic of federal systems?",
          "choices": [
              "Centralized decision-making by a single power center",
              "Negotiation and shared decision-making among multiple power centers",
              "Imposing uniform policies on all member states",
              "Ignoring the interests of individual states"
          ],
          "correct_answer": 1,
          "explanation": "Federal systems are defined by the principle of shared decision-making and negotiation among multiple power centers, as opposed to centralized authority."
      },
      {
          "question": "What are the two main types of federalism?",
          "choices": [
              "Ethnic federalism and geopolitical federalism",
              "Unitary federalism and decentralized federalism",
              "Economic federalism and social federalism",
              "Constitutional federalism and revolutionary federalism"
          ],
          "correct_answer": 0,
          "explanation": "The text explicitly divides federalism into ethnic federalism and geopolitical federalism."
      },
      {
          "question": "In the context of Ethiopia, when was ethnic federalism implemented?",
          "choices": [
              "1991",
              "1995",
              "2008",
              "2002"
          ],
          "correct_answer": 0,
          "explanation": "The passage states that ethnic federalism was introduced in Ethiopia in 1991, following the collapse of military rule."
      },
      {
          "question": "What is the main controversial issue related to ethnic federalism in Ethiopia?",
          "choices": [
              "The lack of a clear definition of ethnic identity",
              "The potential for ethnic conflict and state disintegration",
              "The lack of economic development in ethnic regions",
              "The dominance of a single ethnic group in the federal government"
          ],
          "correct_answer": 1,
          "explanation": "The text highlights the concern that ethnic federalism could lead to ethnic conflict and state disintegration, as expressed by opponents of this system."
      },
      {
          "question": "According to critics of ethnic federalism in Ethiopia, what is the role of ethnic organizations?",
          "choices": [
              "They act as independent advocates for their respective ethnic groups",
              "They serve as true representatives of their respective ethnic communities",
              "They function as mere satellites of the ruling coalition",
              "They promote unity and cooperation among different ethnic groups"
          ],
          "correct_answer": 2,
          "explanation": "The text states that critics view ethnic organizations as being controlled by the ruling coalition, undermining the concept of genuine self-determination."
      },
      {
          "question": "What is the main argument in favor of ethnic federalism in Ethiopia?",
          "choices": [
              "It promotes ethnic unity and stability",
              "It guarantees a fair distribution of resources",
              "It strengthens the central government's authority",
              "It fosters economic development in all regions"
          ],
          "correct_answer": 0,
          "explanation": "Supporters of ethnic federalism argue that it maintains the unity of the Ethiopian people and recognizes ethnic equality."
      },
      {
          "question": "What is a significant socio-cultural impact of ethnic federalism in Ethiopia?",
          "choices": [
              "The rise of new and stronger ethnic identities",
              "The decline in cultural diversity and assimilation",
              "The erosion of traditional values and customs",
              "The increase in inter-ethnic cooperation and understanding"
            ],
            "correct_answer": 0,
            "explanation": "The text highlights the impact of ethnic federalism on traditional values and customs, including the appropriation of land and cultural sites."
        },
        {
            "question": "What is a major concern regarding the implementation of ethnic federalism in Ethiopia?",
            "choices": [
                "The lack of sufficient resources to implement the system effectively",
                "The difficulty in achieving true ethnic equality in practice",
                "The potential for corruption and abuse of power",
                "The lack of qualified individuals to lead ethnic regions"
            ],
            "correct_answer": 1,
            "explanation": "The text discusses the challenges of achieving true ethnic equality and how the system can be manipulated for political gain."
        },
        {
            "question": "What is the ultimate recommendation for addressing the challenges of ethnic federalism in Ethiopia?",
            "choices": [
                "To strengthen the central government's authority and control over ethnic regions",
                "To promote a more diverse and inclusive political system with less emphasis on ethnicity",
                "To establish a stronger military presence in ethnic regions to prevent conflict",
                "To create more autonomous ethnic regions with greater self-governing powers"
            ],
            "correct_answer": 1,
            "explanation": "The text emphasizes the need for a non-ethnic, non-tribal multi-party democracy to address the underlying issues of conflict and instability."
        }
    ]
}