// ✦ JUST FOR YOU — Make it yours in 5 minutes ✦
// Change everything between the quotes and brackets below

const story = {
    // 👤 WHO IS THIS FOR?
    person: {
        name: "Her Name",
        pronoun: "her" // her / him / them
    },

    // 💭 FIRST IMPRESSION (they see this first)
    opening: {
        line1: "Hey, Her Name.",
        line2: "I made something for you.",
        buttonText: "See what's inside →"
    },

    // 📸 YOUR MEMORIES TOGETHER (add as many as you want)
    memories: [
        {
            date: "March 2026",
            title: "The day we met",
            description: "You walked in and suddenly the room felt different. I still remember exactly what you were wearing.",
            image: "assets/images/memory-1.jpg"
        },
        {
            date: "April 2026", 
            title: "Coffee & conversations",
            description: "Three hours felt like three minutes. I knew then that talking to you was my new favorite thing.",
            image: "assets/images/memory-2.jpg"
        },
        {
            date: "May 2026",
            title: "That sunset",
            description: "We didn't say much. We didn't need to. That's when I realized.",
            image: "assets/images/memory-3.jpg"
        }
    ],

    // 🎮 PLAYFUL MOMENT (optional — lightens the mood)
    playful: {
        enabled: true,
        question: "Quick question...",
        optionA: "Pizza 🍕",
        optionB: "Talking to you",
        responseA: "Wrong. But I respect your honesty.",
        responseB: "Obviously. It's not even close."
    },

    // 💌 YOUR LETTER (write from the heart — keep it real)
    letter: `I don't know exactly when it happened.

Somewhere between the late-night conversations and the stupid jokes, between the random voice messages and the way you laugh at things that aren't even that funny — somewhere in there, you became really important to me.

I started looking forward to my phone buzzing. I started saving things to tell you later. I started noticing small things about you that I couldn't stop thinking about.

What I'm trying to say is — you're not just someone I talk to. You're someone I care about. A lot. And I wanted you to know that in a way that felt a little more special than just a text message.

So I built this. Just for you.`,

    // 💭 BUILDUP (right before the question)
    buildup: {
        line1: "So I've been thinking...",
        line2: "About you. About us.",
        line3: "And there's something I want to ask you."
    },

    // ❤️ THE QUESTION
    question: "Will you be my girlfriend?",

    // 🎉 IF THEY SAY YES
    yes: {
        line1: "Wait, really?",
        line2: "You just made me so happy.",
        line3: "I can't wait for what's next."
    },

    // 💛 IF THEY NEED TIME
    maybe: {
        message: "That's completely okay. Take all the time you need. I'm not going anywhere."
    },

    // 🎵 MUSIC (optional — add an mp3 file to assets/music/)
    music: {
        enabled: false,
        file: "assets/music/your-song.mp3",
        volume: 0.3
    },

    // 🤫 SECRET MESSAGE (hidden easter egg)
    secret: "Psst... you're really cute when you're curious."
};