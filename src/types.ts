export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  xp: number;
  content: string;
  codeSnippet?: string;
  expectedOutput?: string;
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  trackId: 'se' | 'ai' | 'web3';
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
  xpReward: number;
  iconName: string;
  isEnrolled?: boolean;
}

export interface EventRecord {
  id: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'Seminar' | 'Social';
  date: string;
  time: string;
  location: string;
  description: string;
  rsvpCount: number;
  isRsvpMe: boolean;
  image: string;
  speakers: string[];
}

export interface VerifiedCredential {
  hash: string;
  recipient: string;
  courseTitle: string;
  issueDate: string;
  grade: string;
  skillsLearned: string[];
  verifiedStatus: 'Verified' | 'Revoked' | 'Pending';
}

export interface ClubProject {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  ownerAvatar: string;
  likes: number;
  isLikedMe?: boolean;
  tags: string[];
  url?: string;
  githubUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: string;
  category: 'learning' | 'events' | 'community' | 'profile';
  unlockedAt?: string;
  isLocked: boolean;
}

export interface ClubMember {
  id: string;
  name: string;
  role: string;
  tagline: string;
  avatar: string;
  xp: number;
  level: number;
  rank: number;
  commits: number;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  image?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  avatar: string;
}

// Pre-populated High-Fidelity Data
export const INITIAL_COURSES: Course[] = [
  {
    id: 'ai-101',
    trackId: 'ai',
    title: 'Foundations of Neural Networks',
    description: 'Learn the core mathematical structures behind deep learning, standard perceptrons, cost functions, and feedforward backpropagation loops.',
    level: 'Intermediate',
    xpReward: 350,
    iconName: 'BrainCircuit',
    isEnrolled: true,
    lessons: [
      {
        id: 'ai-l1',
        title: 'Introduction to Perceptrons & Weights',
        duration: '15 mins',
        isCompleted: false,
        xp: 100,
        content: `Neural networks are computational models inspired by the brain. At their core is the **Perceptron**, which takes a set of binary inputs, multiplies them by corresponding weights, sums them, and passes them through an activation function.

Mathematically, a perceptron calculates a weighted sum:
\\[ f(x) = \\sigma(\\sum_{i} w_i x_i + b) \\]

Where:
* \\( w \\) is the weight vector indicating connection strength.
* \\( x \\) is the input vector.
* \\( b \\) is the bias offset.
* \\( \\sigma \\) is the non-linear activation function (e.g., Sigmoid, ReLU).`,
        codeSnippet: `// Let's implement a single perceptron activation in TypeScript
function activate(inputs: number[], weights: number[], bias: number): number {
  const weightedSum = inputs.reduce((sum, val, idx) => sum + (val * weights[idx]), 0) + bias;
  // Apply a simple step function activation (1 if sum >= 0 else 0)
  return weightedSum >= 0 ? 1 : 0;
}

console.log(activate([1, 0, 1], [0.5, -0.2, 0.3], -0.4));`,
        expectedOutput: '1',
        quiz: [
          {
            question: 'What is the mathematical role of "bias" in a perceptron model?',
            options: [
              'It forces the input parameters to stay within boundaries.',
              'It shifts the activation function curve to the left or right, allowing control over threshold activation.',
              'It multiplies the outputs to amplify final classification scores.',
              'It completely disables negative neuron inputs.'
            ],
            correctAnswer: 1,
            explanation: 'The bias term allows the neuron to shift its activation threshold. An offset bias is crucial for shifting the decision boundary without modifying the individual weights.'
          }
        ]
      },
      {
        id: 'ai-l2',
        title: 'Non-Linear Activation Functions',
        duration: '20 mins',
        isCompleted: false,
        xp: 150,
        content: `Without non-linear activation functions, a multi-layer neural network collapses into a single large linear equation. 
The introduction of functions like **Sigmoid**, **Tanh**, and **ReLU** (Rectified Linear Unit) allows deep structures to approximate highly complex, non-linear boundaries.

Let's look at the standard **ReLU** function:
\\[ f(x) = \\max(0, x) \\]

And the **Sigmoid** function:
\\[ S(x) = \\frac{1}{1 + e^{-x}} \\]`,
        codeSnippet: `// Implement Sigmoid and ReLU activation functions
function relu(x: number): number {
  return Math.max(0, x);
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

console.log("ReLU(-5):", relu(-5), "Sigmoid(0):", sigmoid(0).toFixed(2));`,
        expectedOutput: 'ReLU(-5): 0 Sigmoid(0): 0.50',
        quiz: [
          {
            question: 'Why are non-linear activation functions vital in neural networks?',
            options: [
              'They speed up the file-access operations of computer chips.',
              'They enable the network to learn complex relationships and non-linear boundaries rather than just simple linear trends.',
              'They guarantee that weights remain positive at all times.',
              'They perform categorical binning of input items automatically.'
            ],
            correctAnswer: 1,
            explanation: 'Non-linear activation functions allow multi-layer neural networks to learn non-linear patterns. Linear functions across layers would compress down to a single linear function, making deep networks useless for non-linear data.'
          }
        ]
      }
    ]
  },
  {
    id: 'se-201',
    trackId: 'se',
    title: 'Advanced Git Workflow & Rebasing',
    description: 'Master git rebase, resolving push conflicts elegantly, cherry-picking commits, and formatting clean multi-branch histories.',
    level: 'Advanced',
    xpReward: 400,
    iconName: 'GitBranch',
    isEnrolled: false,
    lessons: [
      {
        id: 'se-l1',
        title: 'Rebase vs Merge',
        duration: '15 mins',
        isCompleted: false,
        xp: 150,
        content: `While **git merge** creates a dedicated merge commit preserving chronological integrity, **git rebase** rewrites history by moving your local branch commits to the tip of standard master.

The key benefit is a tidy linear history. Instead of muddying your branch with repeated "merge master" commits, you replay your changes right on top of the latest development master.`,
        codeSnippet: `# Interactive rebasing of the last 3 local commits
git rebase -i HEAD~3

# In the interactive editor, you can:
# - pick: keep commit
# - squash: blend commit into previous
# - reword: edit commit text`,
        quiz: [
          {
            question: 'What is a major risk associated with running git rebase on a shared public branch?',
            options: [
              'It instantly deletes the main branch from GitHub.',
              'It rewrites commit history, which forces fellow developers to force-pull and can cause severe local repository conflicts.',
              'It encrypts existing code blocks within the root folder.',
              'Git forbids rebasing completely on files that are larger than 1MB.'
            ],
            correctAnswer: 1,
            explanation: 'Never rebase public, shared commits! Rebasing rewrites Git hashes. If other developers are working on top of those commits, rewriting them causes duplicated commits and severe confusion.'
          }
        ]
      }
    ]
  },
  {
    id: 'web3-101',
    trackId: 'web3',
    title: 'Smart Contracts with Solidity',
    description: 'Delve into blockchain structures, writing gas-optimized Solidity smart contracts, states, and deploying to test networks.',
    level: 'Intermediate',
    xpReward: 300,
    iconName: 'Cpu',
    isEnrolled: false,
    lessons: [
      {
        id: 'web3-l1',
        title: 'Solidity Structure & State Variables',
        duration: '25 mins',
        isCompleted: false,
        xp: 150,
        content: `Ethereum smart contracts are self-executing software programs deployed to the blockchain. **Solidity** is a contract-oriented, high-level computer language.

Every Solidity contract holds key persistent states on the ledger, requiring gas fees whenever variables are updated. Keeping operations optimized is vital.`,
        codeSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count;

    function increment() public {
        count += 1;
    }
}`,
        quiz: [
          {
            question: 'What happens to changes made to contract variables if a transaction runs out of gas during run-time?',
            options: [
              'The changes remain frozen in positive memory tables.',
              'All state changes are rolled back completely as if the transaction never completed.',
              'The contracts are deleted instantly from the blockchain.',
              'Only half of the variables are stored permanently.'
            ],
            correctAnswer: 1,
            explanation: 'If a transaction runs out of gas, Ethereum rolls back all modified state variables completely to preserve safety, though the gas consumed is still paid to miners.'
          }
        ]
      }
    ]
  }
];

export const INITIAL_EVENTS: EventRecord[] = [
  {
    id: 'ev-1',
    title: 'Zenith Hackathon 2026',
    type: 'Hackathon',
    date: 'July 11, 2026',
    time: '09:00 AM - July 12, 06:00 PM',
    location: 'Engineering Science Auditorium / Hybrid',
    description: 'A 36-hour sprint bringing student developers together to conceptualize, design, and build AI-driven applications utilizing modern cloud stacks.',
    rsvpCount: 142,
    isRsvpMe: true,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    speakers: ['Sarah Chen (Senior AI Researcher at Anthropic)', 'Marc Andreessen (Software General Partner)']
  },
  {
    id: 'ev-2',
    title: 'Building Production LLM Agents',
    type: 'Workshop',
    date: 'June 28, 2026',
    time: '02:00 PM - 05:00 PM',
    location: 'Tech Seminar Hall 3',
    description: 'Practical, code-first guide covering vector databases, query routers, retrieval augmented generation, and functional tooling arrays.',
    rsvpCount: 88,
    isRsvpMe: false,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800',
    speakers: ['Gaurav Sharma (Founding Lead, Codezen)', 'Alex Rivera (Staff Engineer at Google)']
  },
  {
    id: 'ev-3',
    title: 'Zero-Knowledge Cryptography Deep Dive',
    type: 'Seminar',
    date: 'August 03, 2026',
    time: '04:00 PM - 06:00 PM',
    location: 'Virtual Broadcast Stage',
    description: 'Deconstruct mathematical proofs of zk-SNARKs and zk-STARKs and understand implementation layouts in modern protocols.',
    rsvpCount: 45,
    isRsvpMe: false,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    speakers: ['Dr. Linda Vance (Chair of Applied Cryptography)']
  }
];

export const INITIAL_CREDENTIALS: VerifiedCredential[] = [
  {
    hash: 'CZ-2026-AI-112A',
    recipient: 'Sarah Jenkins',
    courseTitle: 'Foundations of Neural Networks',
    issueDate: 'May 12, 2026',
    grade: 'A+ (98%)',
    skillsLearned: ['Neural Networks', 'Backpropagation', 'Activation Functions', 'PyTorch Layouts'],
    verifiedStatus: 'Verified'
  },
  {
    hash: 'CZ-2026-SE-404B',
    recipient: 'Marcus Aurel',
    courseTitle: 'Advanced Git Workflow & Rebasing',
    issueDate: 'June 02, 2026',
    grade: 'A (93%)',
    skillsLearned: ['Git Rebase', 'Git Conflict Solving', 'Branch Sanitizing', 'Squashing Commits'],
    verifiedStatus: 'Verified'
  }
];

export const INITIAL_PROJECTS: ClubProject[] = [
  {
    id: 'proj-1',
    title: 'SynapseVibe IDE Helper',
    description: 'An AI-powered editor expansion predicting real-time test files based on functional code imports and structural edits.',
    ownerName: 'Devon Green',
    ownerAvatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Devon',
    likes: 42,
    isLikedMe: false,
    tags: ['AI Workspace', 'TypeScript', 'VSCode API']
  },
  {
    id: 'proj-2',
    title: 'EtherLocker Gas Saver',
    description: 'A custom analyzer checking smart contract storage variables syntax to suggest optimization paths saving solid transaction fees.',
    ownerName: 'Ami Patel',
    ownerAvatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ami',
    likes: 29,
    isLikedMe: false,
    tags: ['Solidity', 'Optimization', 'Hardhat']
  },
  {
    id: 'proj-3',
    title: 'Codezen Discord Agent',
    description: 'A Discord notification bot integrated with GitHub webhooks syncing student project activities into specific team threads.',
    ownerName: 'Gaurav Sharma',
    ownerAvatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gaurav',
    likes: 56,
    isLikedMe: true,
    tags: ['Node.js', 'Webhooks', 'Discord Dev']
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Hello Codezen Builder',
    description: 'Set up your developer credentials profile in your customized Member Dashboard.',
    xp: 50,
    icon: 'User',
    category: 'profile',
    isLocked: false,
    unlockedAt: 'June 17, 2026'
  },
  {
    id: 'ach-2',
    title: 'First Commit',
    description: 'Answer your first Learning Hub track assignment quiz correctly.',
    xp: 100,
    icon: 'CheckSquare',
    category: 'learning',
    isLocked: true
  },
  {
    id: 'ach-3',
    title: 'Zenith Attendee',
    description: 'RSVP to your first official community event or hackathon schedule.',
    xp: 100,
    icon: 'Calendar',
    category: 'events',
    isLocked: true
  },
  {
    id: 'ach-4',
    title: 'Open Source Supporter',
    description: 'Upvote a student project in the Community Showroom list.',
    xp: 50,
    icon: 'Heart',
    category: 'community',
    isLocked: false,
    unlockedAt: 'June 17, 2026'
  },
  {
    id: 'ach-5',
    title: 'Scholar Status',
    description: 'Fully finish any Learning Hub course track with 100% completions.',
    xp: 250,
    icon: 'Award',
    category: 'learning',
    isLocked: true
  }
];

export const INITIAL_MEMBER: ClubMember = {
  id: 'usr-99',
  name: 'Garg Gourav',
  role: 'Junior Software Engineer',
  tagline: 'Passionate stack explorer seeking elegant AI engineering practices and Git fluency.',
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Garg',
  xp: 180,
  level: 1,
  rank: 14,
  commits: 47,
  skills: ['TypeScript', 'React', 'Node.js', 'Python', 'Tailwind CSS'],
  githubUrl: 'https://github.com/gouravgarg',
  linkedinUrl: 'https://linkedin.com/in/gouravgarg'
};

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Art of Clean Git Commit History',
    excerpt: 'How to structure interactive rebases, craft expressive commit descriptions, and keep collaborative projects readable.',
    content: `A clean Git commit history is like a well-written book: it describes the chronological evolution of a system clearly, systematically, and precisely.

### Why Care about Commits?
Many developers view git messages as an afterthought. However, when working on high-performance industrial software products, a messy history with commits like 'fix 1', 'temp fix', 'test code' makes root-cause analysis, bug tracking, and code reversion incredibly complex.

### Best Practices
1. **Use Imperative Tone**: Write commit titles as action statements (e.g. 'Add schema definition' rather than 'Added schema definition').
2. **Squash Micro-Commits**: Use interactive rebasing 'git rebase -i HEAD~N' to clean up intermediate errors before sending pull requests.
3. **Reference Issues**: Link key ticket indices internally in descriptions.`,
    author: 'Gaurav Sharma',
    date: 'June 10, 2026',
    readTime: '4 min read',
    tags: ['Git', 'Software Craftsmanship', 'Vite']
  },
  {
    id: 'blog-2',
    title: 'Demystifying Non-Linear Activation Functions',
    excerpt: 'An interactive exploration of Sigmoids, ReLU activations, and why our multi-layer neural networks collapse without them.',
    content: `Neural networks have become the cornerstone of modern AI interfaces. But what makes them learn complex, highly non-linear functions?

The secret lies in **Activation Functions**. 

### The Collapse of Linearity
If all activation functions in a multi-layer neural network are simple line graphs, the mathematical result is just a series of matrix multiplications. In linear algebra, multiplying many matrices together simply results in a single, collapsed linear equation! Thus, no matter how many layers you have, your network can only solve simple straight boundaries.

By adding functions like **ReLU** (f(x) = max(0, x)) or **Sigmoid**, we introduce non-linearities, enabling networks to solve organic boundaries.`,
    author: 'Sarah Jenkins',
    date: 'May 28, 2026',
    readTime: '6 min read',
    tags: ['AI', 'Neural Networks', 'Math']
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  { id: 'tm-1', name: 'Gaurav Sharma', title: 'Community Founder', role: 'Fullstack Platform Architect', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gaurav' },
  { id: 'tm-2', name: 'Sarah Jenkins', title: 'Core UI/UX Designer', role: 'Visual Systems & Typography', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Sarah' },
  { id: 'tm-3', name: 'Marcus Aurel', title: 'Core Systems Engineer', role: 'Vite & TS Compiler Pipelines', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Marcus' },
  { id: 'tm-4', name: 'Elena Rostova', title: 'Core Operations Head', role: 'National Sprints & Relations', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Elena' }
];
