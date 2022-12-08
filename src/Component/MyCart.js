import "../CSS/MyCart.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useCallback } from "react";
import { Link } from "react-router-dom";

function MyCart() {
    const memEmail = sessionStorage.getItem("email");
    const [data, setData] = useState([]);
    const [checkedList, setCheckedLists] = useState([]);
    
    const plusClick = (cartIdx,itemAmount)=> {
        const cartListDto = {
            cartIdx : cartIdx,
            itemAmount : itemAmount+1,
            memEmail : memEmail

        }
        axios.post("http://localhost:8080/cart/update", cartListDto).then(response => {

            console.log(response);
            alert('수정성공');
            setData(response.data);
            setCheckedLists([]);
        })
  };

  const minusClick = (cartIdx, itemAmount) => {
    if (itemAmount === 1) {
      return;
    } else {
      setData(
        data.map((item) => {
          return item.cartIdx === cartIdx && item.itemAmount > 1
            ? { ...item, itemAmount: item.itemAmount - 1 }
            : item;
        })
      );

        const cartListDto = {
            cartIdx : cartIdx,
            itemAmount : itemAmount-1,
            memEmail : memEmail

        }
        axios.post("http://localhost:8080/cart/update", cartListDto).then(response => {
            console.log(response);
            alert('수정성공');
            setData(response.data);
            setCheckedLists([]);
        })
        .catch((error) => {
          alert("수정실패");
          console.log(error);
        });
      console.log(cartIdx);
      console.log(itemAmount);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/cart/${memEmail}`)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const cartDelete = () => {
    console.log(checkedList);
    console.log(checkedList.map((list) => list.cartIdx));

        const confirm = window.confirm(checkedList.length+"개의 상품 정말 삭제하시겠습니까?");
        if(confirm)
        axios.post("http://localhost:8080/cart/delete", checkedList)
            .then(response => {
                console.log(response);
                alert('삭제성공');
                setData(response.data);
                setCheckedLists([]);
            })
            .catch(error => { 
                alert('삭제실패');
                console.log(error) });
    }


  // 전체 체크 클릭 시 발생하는 함수
  const onCheckedAll = (checked) => {
    if (checked) {
      const checkedListArray = [];

      data.forEach((item) => checkedListArray.push(item));

      setCheckedLists(checkedListArray, console.log(checkedListArray));
    } else {
      setCheckedLists([]);
    }
  };

  const onCheckedElement = (checked, item) => {
    if (checked) {
      setCheckedLists([...checkedList, item], console.log(checkedList));
    } else {
      setCheckedLists(checkedList.filter((el) => el !== item));
    }
  };

  return (
    <>
      <div id="main">
        <div className="mycart_wrap">
          <div className="mycart_title_wrap">
            <h2>장바구니</h2>
          </div>
          <div className="mycart_list_wrap">
            <table>
              <thead>
                <tr>
                  <td className="mycart_check_all_td">
                    <input
                      type="checkbox"
                      name="select-all"
                      className="cart_chk_box"
                      onChange={(e) => onCheckedAll(e.target.checked)}
                      checked={
                        checkedList.length === 0
                          ? false
                          : checkedList.length === data.length
                          ? true
                          : false
                      }
                    />
                  </td>
                  <td>제품정보</td>
                  <td>수량</td>
                  <td>금액</td>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>

                    <td colSpan={4}>장바구니가 비었습니다.</td>

                  </tr>
                ) : (
                  data &&
                  data.map((item) => (
                    <tr>
                      <td>
                        <div className="mycart_check">
                          <input
                            key={item.cartIdx}
                            type="checkbox"
                            name={`select-${item.cartIdx}`}
                            onChange={(e) =>
                              onCheckedElement(e.target.checked, item)
                            }
                            checked={checkedList.includes(item) ? true : false}
                          />
                        </div>
                      </td>
                      <td className="mycart_item_info_td">
                        <Link to={`/item/${item.itemNum}`}>
                          <div className="mycart_item_info_wrap">
                            <img
                              src={
                                process.env.REACT_APP_API_URL + item.itemThumb
                              }
                              className="mycart_item_img"
                              alt="상품썸네일"
                            />
                            <div className="mycart_item_name">
                              {item.itemName}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="mycart_item_count_td">
                        <button
                          onClick={() => {
                            plusClick(item.cartIdx, item.itemAmount);
                          }}
                        >
                          <IoIosArrowUp />
                        </button>
                        <input value={item.itemAmount}></input>
                        <button
                          onClick={() => {
                            minusClick(item.cartIdx, item.itemAmount);
                          }}
                        >
                          <IoIosArrowDown />
                        </button>
                      </td>
                      <td className="mycart_item_price_td">
                        {item.itemPrice * item.itemAmount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mycart_btn_wrap">
            <div className="mycart_btn_wrap_inner">
              <button
                type="button"
                form="cartList"
                onClick={cartDelete}
                className="mycart_delete_btn"
              >
                선택 항목 삭제
              </button>
              {data.length === 0 ? null :  <Link to="/order" state={{ orderDto: checkedList }}>
                <button className="mycart_buy_btn" type="button">
                  선택 주문
                </button>
              </Link>} 
              {data.length === 0 ? null : <Link to="/order" state={{ orderDto: data }}>
                <button className="mycart_buy_btn" type="button">
                  전체 주문
                </button>
              </Link>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyCart;
