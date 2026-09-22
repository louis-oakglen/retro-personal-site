export const PUZZLES = [
 ['PROMPT','Everyday AI','The instruction you give an AI.','It tells the model what you want it to do.','“Summarise this email in one sentence” is one.'],
 ['MODEL','The basics','The trained system behind an AI tool.','It learns patterns from data.','A chatbot sends your question to a language _____.'],
 ['TOKEN','Language','A small chunk of text that a language model reads.','It can be a word, part of a word, or punctuation.','A long word can be split into more than one of these.'],
 ['AGENT','Taking action','An AI system that can take steps towards a goal.','It may use tools, inspect results, and decide what to do next.','It might search for information, then use it to complete a task.'],
 ['TRAIN','Learning','To teach a model using examples.','This process adjusts the model’s internal parameters.','You can _____ a model on labelled photographs.'],
 ['IMAGE','Creative AI','A picture an AI can generate or analyse.','It is made up of pixels.','Ask a model to draw a cat and this is the output.'],
 ['VOICE','Everyday AI','What lets you speak to an assistant instead of typing.','AI can recognise it, or generate it.','A spoken response uses a synthetic _____.'],
 ['AUDIO','Everyday AI','Sound that a model can process.','Speech and music are both examples.','A microphone records this type of input.'],
 ['LABEL','Learning','The answer attached to a training example.','It tells a supervised model what an example represents.','“Cat” written beside a cat photo is one.'],
 ['LAYER','Inside a model','One stage in a neural network.','Information passes through several of these.','A deep network has many of them stacked together.'],
 ['WEIGHT','Inside a model','A learned number that influences a model’s calculations.','Training adjusts billions of these in some large models.','It controls how strongly one signal affects another.'],
 ['VECTOR','Working with data','An ordered list of numbers that can represent meaning.','Similar items can have nearby representations.','An embedding is often stored as this mathematical object.'],
 ['NEURAL','Inside a model','The word before “network” in many AI systems.','It refers loosely to inspiration from connected nerve cells.','A ______ network learns by adjusting its connections.'],
 ['SEARCH','Finding answers','Looking through information for a useful match.','AI can help rank the most relevant results.','Semantic ______ finds meaning, not just matching words.'],
 ['CONTEXT','Language','The information available to a model for its current response.','It can include your messages and supplied documents.','A _______ window has a limit measured in tokens.'],
 ['OUTPUT','The basics','What comes back after you give a model an input.','It could be text, a picture, or a prediction.','The generated answer is the model’s ______.'],
 ['INPUT','The basics','What you give a model to work with.','Text, sound and pictures can all be examples.','It is the opposite of output.'],
 ['LEARN','The basics','To pick up patterns from examples.','Machine learning algorithms do this during training.','The aim is to _____ patterns that work on new data too.'],
 ['VISION','Seeing','The field that helps computers interpret pictures.','It includes recognising objects in photographs.','Computer ______ also works with video.'],
 ['SPEECH','Language','Spoken language that AI can turn into text.','Recognition systems transcribe it.','______-to-text turns a recording into written words.'],
 ['REASON','Solving problems','To work through information towards a conclusion.','Some AI tasks need several logical steps.','A model may be asked to ______ through a maths problem.'],
 ['FILTER','Responsible use','To screen out unwanted content or results.','It can be applied before or after a model responds.','A spam ______ keeps unwanted messages out of your inbox.'],
 ['SAFETY','Responsible use','Work to reduce harm from AI systems.','It includes testing risks and adding safeguards.','AI ______ asks what could go wrong and how to prevent it.'],
 ['ROBOTS','In the real world','Physical machines that can sense and act.','Some use AI to navigate or handle objects.','These machines can work in factories or explore other planets.'],
 ['CODING','Building things','Writing instructions that a computer can run.','AI assistants can help with this software task.','Debugging and writing functions are parts of it.'],
 ['TUNING','Learning','Adjusting a model for a particular task.','Put “fine” before it for a common training technique.','Fine-______ can adapt a model using specialised examples.'],
 ['DECODE','Language','To turn a model’s generated tokens into readable text.','It is the reverse of encoding.','A tokenizer can encode text and ______ token IDs.'],
 ['EMBED','Working with data','To represent an item in a numerical space.','The result is called an embedding.','You can _____ text as a vector for semantic search.'],
 ['SAMPLE','Generation','To choose an output from a probability distribution.','This can introduce variety into generated text.','A model can ______ the next token instead of always taking the most likely one.'],
 ['BATCH','Learning','A group of examples processed together.','It is smaller than the full training dataset.','Training often uses a mini-_____ at each step.'],
 ['EPOCH','Learning','One pass through the training dataset.','Training may repeat this many times.','After every example has been used once, one _____ is complete.'],
 ['NOISE','Creative AI','Random variation that some image models learn to remove.','Diffusion models gradually clean it away.','A generated image can start from a field of random _____.'],
 ['PIXEL','Seeing','A single tiny unit of a digital image.','It holds colour information.','Zoom far into a picture and you may see each one.'],
 ['SCORE','Testing','A number used to report how well a model did.','It summarises performance on a particular test.','A benchmark gives a model this, but it never tells the whole story.'],
 ['REWARD','Learning','A signal that tells a learning system how well it did.','Reinforcement learning tries to maximise it.','A game-playing agent may receive this for winning.'],
 ['POLICY','Learning','The rule or strategy an agent uses to choose actions.','In reinforcement learning, this can itself be learned.','It maps an observation to an action or its probabilities.'],
 ['MEMORY','Everyday AI','Saved information an assistant can use later.','It can help maintain preferences across conversations.','It is separate from what is currently in the context window.'],
 ['STREAM','Generation','To deliver a response bit by bit as it is generated.','You see the answer appear before it has finished.','A chatbot can ______ its response instead of waiting for the full text.'],
 ['CHATBOT','Everyday AI','Software you talk to through messages.','It responds in a conversational format.','An AI assistant in a chat window is one.'],
 ['PREDICT','The basics','To estimate an outcome from available information.','It might be a number, a class, or the next word.','A language model learns to ______ the next token.'],
];
export function feedback(guess,answer){
 const result=Array(answer.length).fill('absent'), remaining={};
 for(let i=0;i<answer.length;i++){if(guess[i]===answer[i])result[i]='exact';else remaining[answer[i]]=(remaining[answer[i]]||0)+1;}
 for(let i=0;i<guess.length;i++)if(result[i]!=='exact'&&remaining[guess[i]]>0){result[i]='present';remaining[guess[i]]--;}
 return result;
}
export function dayKey(date=new Date()){return date.toISOString().slice(0,10);}
export function puzzleIndex(day){const days=Math.floor(Date.parse(day+'T00:00:00Z')/86400000);return ((days*17+11)%PUZZLES.length+PUZZLES.length)%PUZZLES.length;}
export function validSave(value,day){return value&&value.day===day&&Array.isArray(value.guesses)&&value.guesses.length<=6&&value.guesses.every(g=>typeof g==='string'&&new RegExp('^[A-Z]{'+PUZZLES[puzzleIndex(day)][0].length+'}$').test(g))&&Number.isInteger(value.hints)&&value.hints>=0&&value.hints<=2;}
