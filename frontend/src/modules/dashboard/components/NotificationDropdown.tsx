import { Bell, Check, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotificationStore } from "../../../store/notification.store";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleNotificationClick = async (
    notificationId: string,
    isRead: boolean,
    link?: string | null,
  ) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }

    setIsOpen(false);

    if (link) {
      navigate(link);
    }
  };

  const formatDate = (date: string) => {
    const notificationDate = new Date(date);
    const now = new Date();

    const diff =
      now.getTime() - notificationDate.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(
      diff / (1000 * 60 * 60 * 24),
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    if (hours < 24) {
      return `${hours}h ago`;
    }

    if (days < 7) {
      return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* Notification Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        title="Notifications"
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors sm:h-10 sm:w-10 ${isOpen
          ? "bg-gray-100 text-gray-800"
          : "hover:bg-gray-100 hover:text-gray-800"
          }`}
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[360px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {unreadCount} unread
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1.5 text-xs font-medium text-orange-500 transition-colors hover:text-orange-600"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-10 text-center text-sm text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto h-8 w-8 text-gray-300" />

                <p className="mt-2 text-sm font-medium text-gray-600">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  You're all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification.id,
                      notification.isRead,
                      notification.link,
                    )
                  }
                  className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${!notification.isRead
                    ? "bg-orange-50/60"
                    : "bg-white"
                    }`}
                >
                  <div className="flex w-2 shrink-0 justify-center pt-1.5">
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>

                      {!notification.isRead && (
                        <span className="shrink-0 text-orange-500">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {notification.message}
                    </p>

                    <p className="mt-1.5 text-xs text-gray-400">
                      {formatDate(
                        notification.createdAt,
                      )}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
