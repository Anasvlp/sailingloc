import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Search, MoreVertical } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { usersAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  receiver: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
}

interface Conversation {
  user: {
    id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  lastMessage: Message
  unreadCount: number
}

const MessageCenter: React.FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: messages, isLoading } = useQuery(
    'user-messages',
    usersAPI.getMessages,
    {
      refetchInterval: 5000 // Refresh every 5 seconds
    }
  )

  const sendMessageMutation = useMutation(usersAPI.sendMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries('user-messages')
      setNewMessage('')
      toast.success('Message envoyé')
    },
    onError: () => {
      toast.error('Erreur lors de l\'envoi du message')
    }
  })

  // Group messages into conversations
  const conversations: Conversation[] = React.useMemo(() => {
    if (!messages?.data || !user) return []

    const conversationMap = new Map<string, Conversation>()

    messages.data.forEach((message: Message) => {
      const otherUser = message.sender.id === user.id ? message.receiver : message.sender
      const conversationId = otherUser.id

      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        })
      }

      const conversation = conversationMap.get(conversationId)!
      
      // Update last message if this one is more recent
      if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
        conversation.lastMessage = message
      }

      // Count unread messages
      if (!message.isRead && message.receiver.id === user.id) {
        conversation.unreadCount++
      }
    })

    return Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )
  }, [messages?.data, user])

  // Get messages for selected conversation
  const conversationMessages = React.useMemo(() => {
    if (!messages?.data || !selectedConversation || !user) return []

    return messages.data
      .filter((message: Message) => 
        (message.sender.id === selectedConversation && message.receiver.id === user.id) ||
        (message.sender.id === user.id && message.receiver.id === selectedConversation)
      )
      .sort((a: Message, b: Message) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
  }, [messages?.data, selectedConversation, user])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    sendMessageMutation.mutate({
      receiverId: selectedConversation,
      content: newMessage.trim()
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }
  }

  const filteredConversations = conversations.filter(conversation =>
    `${conversation.user.firstName} ${conversation.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.user.id}
                onClick={() => setSelectedConversation(conversation.user.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                  selectedConversation === conversation.user.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {conversation.user.avatar ? (
                      <img
                        src={conversation.user.avatar}
                        alt={`${conversation.user.firstName} ${conversation.user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" />
                      </div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.user.firstName} {conversation.user.lastName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Aucune conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const conversation = conversations.find(c => c.user.id === selectedConversation)
                  return conversation ? (
                    <>
                      {conversation.user.avatar ? (
                        <img
                          src={conversation.user.avatar}
                          alt={`${conversation.user.firstName} ${conversation.user.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-600" />
                        </div>
                      )}
                      <h3 className="font-medium text-gray-900">
                        {conversation.user.firstName} {conversation.user.lastName}
                      </h3>
                    </>
                  ) : null
                })()}
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {conversationMessages.map((message: Message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${message.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender.id === user?.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender.id === user?.id ? 'text-primary-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sendMessageMutation.isLoading}
                  className="btn-primary px-4 py-2 disabled:opacity-50"
                >
                  {sendMessageMutation.isLoading ? (
                    <div className="spinner w-4 h-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageCenter