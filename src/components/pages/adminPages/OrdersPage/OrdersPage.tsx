import Actions from "../../../layouts/adminLayouts/Actions/Actions";
import Content from "../../../layouts/adminLayouts/Content/Content";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import Order from "../../../admin/Order/Order";
import Card from "../../../UI/Card/Card";
import Loader from "../../../UI/Loader/Loader";
import Placeholder from "../../../UI/Placeholder/Placeholder";
import { NO_ORDERS } from "../../../../constants/messages";
import { OrderItem } from "../../../../types/common";
import { useState } from "react";

const OrdersPage: React.FC = () => {
  const { orders, isLoading } = useSelector((state: RootState) => state.common);
  const [localOrders, setLocalOrders] = useState(orders);

  console.log(orders);

  const handleStatusChange = (orderId: string, newStatus: any) => {
    setLocalOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  return (
    <>
      <Actions title={"Заказы"} />

      <Content>
        <>
          {isLoading && <Loader />}
          {!isLoading && (
            <Card fullWidth>
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Покупатель</th>
                      <th>Телефон</th>
                      <th>Адрес</th>
                      <th>Статус</th>
                      <th>Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localOrders.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <Placeholder text={NO_ORDERS} />
                        </td>
                      </tr>
                    )}

                    {localOrders.map(
                      ({
                        id,
                        userName,
                        userPhone,
                        userAddress,
                        totalPrice,
                        totalWeight,
                        totalDiscount,
                        cart,
                        timestamp,
                        status,
                      }) => (
                        <Order
                          key={id}
                          id={id}
                          userName={userName}
                          userPhone={userPhone}
                          userAddress={userAddress}
                          cart={cart}
                          totalPrice={totalPrice}
                          timestamp={timestamp}
                          totalWeight={totalWeight}
                          totalDiscount={totalDiscount}
                          status={status}
                          onStatusChange={(newStatus) =>
                            handleStatusChange(id, newStatus)
                          }
                        />
                      ),
                    )}
                  </tbody>
                </table>
              </>
            </Card>
          )}
        </>
      </Content>
    </>
  );
};

export default OrdersPage;
