import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { showAlert } from "../../../store/CommonSlice";
import { AlertType } from "../../../types/common";
import {
  CartItem,
  Order as OrderItem,
  OrderItem as OrderCartItemType,
} from "../../../types/common";
import classes from "./Order.module.css";
import OrderCartItem from "./OrderCartItem/OrderCartItem";

interface IOrderProps {
  id: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  timestamp: OrderItem["timestamp"];
  totalPrice: OrderItem["totalPrice"];
  totalDiscount: OrderItem["totalDiscount"];
  totalWeight: OrderItem["totalWeight"];
  status: OrderItem["status"];
  cart: OrderCartItemType[];
  onStatusChange?: (newStatus: OrderItem["status"]) => void;
}

const Order: React.FC<IOrderProps> = ({
  id,
  userName,
  userPhone,
  userAddress,
  timestamp,
  totalPrice,
  cart,
  totalDiscount,
  totalWeight,
  status,
  onStatusChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const date = new Date(timestamp).toLocaleDateString("Ru-ru");

  const statuses: OrderItem["status"][] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  const statusColors: Record<OrderItem["status"], string> = {
    PENDING: "#fbbf24",
    PROCESSING: "#60a5fa",
    SHIPPED: "#34d399",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
  };

  const statusLabels: Record<OrderItem["status"], string> = {
    PENDING: "Ожидание",
    PROCESSING: "Обработка",
    SHIPPED: "Отправлено",
    DELIVERED: "Доставлено",
    CANCELLED: "Отменено",
  };

  const toggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleStatusChange = async (newStatus: OrderItem["status"]) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `https://backendstore-9jt0.onrender.com/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Не удалось обновить статус заказа");
      }

      dispatch(
        showAlert({
          type: AlertType.Success,
          message: "Статус заказа успешно обновлён",
        }),
      );

      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error) {
      dispatch(
        showAlert({
          type: AlertType.Error,
          message:
            error instanceof Error
              ? error.message
              : "Ошибка при обновлении статуса",
        }),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <tr onClick={toggle} className={classes["summary-row"]}>
        <td className={classes["sumarry-cell"]}>{date}</td>
        <td className={classes["sumarry-cell"]}>{userName}</td>
        <td className={classes["sumarry-cell"]}>{userPhone}</td>
        <td className={classes["sumarry-cell"]}>{userAddress}</td>
        <td className={classes["sumarry-cell"]}>
          <select
            className={classes["status-select"]}
            value={status}
            onChange={(e) =>
              handleStatusChange(e.target.value as OrderItem["status"])
            }
            disabled={isUpdating}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: statusColors[status] }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </td>
        <td className={classes["sumarry-cell"]}>{totalPrice} ₽</td>
      </tr>

      {isCollapsed && (
        <>
          <tr className={classes["no-pointer-events"]}>
            <td colSpan={7}></td>
          </tr>
          <tr>
            <td colSpan={7} className={classes["order-content"]}>
              <div>
                <span className={classes["order-content-title"]}>
                  Состав заказа
                </span>

                <table className={classes.table}>
                  <thead>
                    <tr className={classes["no-pointer-events"]}>
                      <th>№</th>
                      <th>Название</th>
                      <th>Кол-во</th>
                      <th>Цена</th>
                      <th>Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((cartItem, idx) => (
                      <OrderCartItem
                        key={cartItem.productId}
                        idx={idx + 1}
                        name={cartItem.name}
                        quantity={cartItem.quantity}
                        price={cartItem.price}
                        discount={cartItem.discount}
                        discountedPrice={cartItem.discountedPrice}
                        totalPrice={cartItem.totalPrice}
                      />
                    ))}

                    <tr className={classes["no-pointer-events"]}>
                      <td colSpan={7}></td>
                    </tr>

                    <tr className={classes["no-pointer-events"]}>
                      <td
                        colSpan={4}
                        className={`${classes.summary} ${classes["left-top-radius"]} ${classes["cell"]}`}
                      >
                        Итог:
                      </td>
                      <td
                        className={`${classes.text} ${classes["right-top-radius"]} ${classes["cell"]}`}
                      >
                        {totalPrice} ₽
                      </td>
                    </tr>

                    <tr className={classes["no-pointer-events"]}>
                      <td
                        colSpan={4}
                        className={`${classes.summary} ${classes["last-cell"]}`}
                      >
                        Скидки:
                      </td>
                      <td className={`${classes.text} `}>{totalDiscount} ₽</td>
                    </tr>

                    <tr className={classes["no-pointer-events"]}>
                      <td
                        colSpan={4}
                        className={`${classes.summary} ${classes["left-bottom-radius"]}`}
                      >
                        Вес:
                      </td>
                      <td
                        className={`${classes.text} ${classes["right-bottom-radius"]}`}
                      >
                        {totalWeight} кг
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
          <tr className={classes["no-pointer-events"]}>
            <td colSpan={7}></td>
          </tr>
          <tr className={classes["no-pointer-events"]}>
            <td colSpan={7}></td>
          </tr>
        </>
      )}
    </>
  );
};

export default Order;
